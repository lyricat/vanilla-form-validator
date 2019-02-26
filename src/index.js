let root = typeof self == 'object' && self.self === self && self || 
typeof global == 'object' && global.global === global && global ||
this || {};

let formData2Map = function (formData) {
  let ret = {}
  for (const key in formData) {
    ret[key] = {
      pass: true,
      value: formData[key]
    }
  }
  return ret
}

let setMapPass = function (m, key, isPass) {
  m[key].pass = isPass
}

let handleRECondition = function (formData, conditions, map) {
  if (conditions.length !== 2) {
    return [false, `Incorrect condition: ${conditions}`]
  }
  if (formData.hasOwnProperty(conditions[1])) {
    let result = conditions[0].test(formData[conditions[1]])
    if (result) {
      setMapPass(map, conditions[1], true)
      return [true, map, 'Pass.']
    } else {
      setMapPass(map, conditions[1], false)
      return [false, map, 'Field `' + conditions[1] + '` failed to pass RegExp test `' + conditions[0].toString() + '`']
    }
  }
  return [false, map, `Can't find field '${conditions[1]}'.`]
}

let _test = function (formData, conditions, map) {
  // conditions should be a nested array in such form:
  // [OP, args ...]
  // in which OP should be:
  //    AND: take one or more args, return true if all args are true
  //    OR: take one or more args, return false if all args are true
  //    RE: take two args, the first one should be a regex, the second should be a string, return regex.test(str)
  let lastMessage = 'Not pass.'
  let op = conditions[0]
  if (op !== 'AND' && op !== 'OR' && op !== 'RE') {
    return [false, `Incorrect Operator '${op}'. Only 'AND', 'OR' or 'RE' is allowed.`]
  }
  conditions = conditions.slice(1)
  if (op === 'RE' && conditions.length === 2) {
    let c= handleRECondition(formData, conditions, map)
    return c
  }
  for (let i = 0; i < conditions.length; i++) {
    const cond = conditions[i]
    if (cond.constructor === String) {
      if (formData.hasOwnProperty(cond) && formData[cond]) {
        lastMessage = `Pass.`
        setMapPass(map, cond, true)
        if (op === 'AND') {
          // pass, check next field
          continue
        } else {
          // pass, return
          return [true, map, lastMessage]
        }
      } else {
        lastMessage = `Failed to validate condition '${cond}'.`
        setMapPass(map, cond, false)
        if (op === 'AND') {
          // failed, return
          return [false, map, lastMessage]
        } else {
          // failed, check next field
          continue
        }
      }
    } else if (cond.constructor === Array) {
      let ret = _test(formData, cond, map)
      if (ret[0]) {
        if (op === 'AND') {
          // pass, check next field
          lastMessage = ret[2]
          continue
        } else {
          // pass, return
          return ret
        }
      } else {
        if (op === 'AND') {
          // failed, return
          return ret
        } else {
          // failed, check next field
          lastMessage = ret[2]
          continue
        }
      }
    }
  }
  if (op === 'AND') {
    return [true, map, lastMessage]
  } else {
    return [false, map, lastMessage]
  }
}

let formToDict = function (form) {
  let coms = form.querySelectorAll('[name]')
  let ret = {}
  for (let i = 0; i < coms.length; i++) {
    const com = coms[i]
    if (com.name) {
      ret[com.name] = com.value
    }
  }
  return ret
}

let test = function (formData, conditions) {
  let payload = formData
  if (formData.constructor !== Object) {
    payload = formToDict(formData)
  }
  let map = formData2Map(payload)
  let result = _test(payload, conditions, map)
  return {
    pass: result[0],
    fields: result[1],
    message: result[2]
  }
}

let FormValidator = {
  handleRECondition: handleRECondition,
  test: test,
  formToDict: formToDict,
}

if (root) {
  root.FormValidator = FormValidator;
}

module.exports = FormValidator
