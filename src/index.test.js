const FormValidator = require('./index');

// don't use those regexps in your project unless you know what you are doing
let email_re = /^\S+@\S+\.\S+$/
let phone_re = /^[0-9]{5}[0-9]+$/
let username_re = /^[a-zA-Z][a-zA-Z0-9_-]{4}[a-zA-Z0-9_-]+$/
let password_re = /^[0-9a-zA-Z]{5}[0-9a-zA-Z]+$/

var commLoginRule = [
  'AND',
  ['OR',
    ['RE', email_re, 'email'],
    ['RE', phone_re, 'phone'],
  ],
  ['RE', username_re, 'username'],
  ['RE', password_re, 'password'],
]

var oneInTwoRule = [
  'OR',
  'id',
  'username'
]

var oneInTwo1Form = {
  id: '123',
  username: 'abc-def',
}

test('One in two fields', () => {
  let ret = FormValidator.test(oneInTwo1Form, oneInTwoRule)
  expect(ret.pass).toBe(true)
  expect(ret.fields.id.pass).toBe(true)
  expect(ret.fields.username.pass).toBe(true)
})

var oneInTwo2Form = {
  id: '',
  username: 'abc-def',
}

test('One in two fields, id is empty', () => {
  let ret = FormValidator.test(oneInTwo2Form, oneInTwoRule)
  expect(ret.pass).toBe(true)
  expect(ret.fields.id.pass).toBe(false)
  expect(ret.fields.username.pass).toBe(true)
})

var oneInTwo3Form = {
  id: '123',
  username: '',
}

test('One in two fields, username is empty', () => {
  let ret = FormValidator.test(oneInTwo3Form, oneInTwoRule)
  expect(ret.pass).toBe(true)
  expect(ret.fields.id.pass).toBe(true)
})

var oneInTwo4Form = {
  id: '',
  username: '',
}

test('One in two fields, both are empty', () => {
  let ret = FormValidator.test(oneInTwo4Form, oneInTwoRule)
  expect(ret.pass).toBe(false)
  expect(ret.fields.id.pass).toBe(false)
  expect(ret.fields.username.pass).toBe(false)
})

var lackOfUsernameForm = {
  name: 'ABC',
  username: '',
  phone: '8618520220323' ,
  email: 'ABC+1@gmail.com',
  password: 'qwert12345'
}

test('A lack of username', () => {
  let ret = FormValidator.test(lackOfUsernameForm, commLoginRule)
  expect(ret.pass).toBe(false)
  expect(ret.fields.username.pass).toBe(false)
  expect(ret.fields.name.pass).toBe(true)
  expect(ret.fields.phone.pass).toBe(true)
  expect(ret.fields.email.pass).toBe(true)
  expect(ret.fields.password.pass).toBe(true)
})

var incorrectPasswordForm = {
  name: 'ABC',
  username: 'abc-def',
  phone: '8618520220323' ,
  email: 'ABC+1@gmail.xxx',
  password: 'qwert12345你好'
}

test('Incorrect password', () => {
  let ret = FormValidator.test(incorrectPasswordForm, commLoginRule)
  expect(ret.pass).toBe(false)
  expect(ret.fields.username.pass).toBe(true)
  expect(ret.fields.name.pass).toBe(true)
  expect(ret.fields.phone.pass).toBe(true)
  expect(ret.fields.email.pass).toBe(true)
  expect(ret.fields.password.pass).toBe(false)
})

var noPhoneAndEmailForm = {
  name: 'ABC',
  username: 'abc-def',
  phone: '' ,
  email: '',
  password: 'qwert12345'
}

test('A lack of phone AND email', () => {
  let ret = FormValidator.test(noPhoneAndEmailForm, commLoginRule)
  expect(ret.pass).toBe(false)
  expect(ret.fields.username.pass).toBe(true)
  expect(ret.fields.name.pass).toBe(true)
  expect(ret.fields.phone.pass).toBe(false)
  expect(ret.fields.email.pass).toBe(false)
  expect(ret.fields.password.pass).toBe(true)
})


var noPhoneForm = {
  name: 'ABC',
  username: 'abc-def',
  phone: '' ,
  email: 'abc+123@gmail.com',
  password: 'qwert12345'
}

test('A lack of phone, but it is ok', () => {
  let ret = FormValidator.test(noPhoneForm, commLoginRule)
  expect(ret.fields.username.pass).toBe(true)
  expect(ret.fields.name.pass).toBe(true)
  expect(ret.fields.phone.pass).toBe(true)
  expect(ret.fields.email.pass).toBe(true)
  expect(ret.fields.password.pass).toBe(true)
})

