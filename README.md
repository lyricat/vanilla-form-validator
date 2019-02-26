# Vanilla Form Validator

A vanilla form validator.

## Demo

WIP

## Method

`FormValidator.test(form | object, rules)`

## How to use

Assume we have a register form with 4 fields, each field has different requirement:

- name: required, any charactors.
- email: format as email.
- phone: one or more digits
- password: alphanumeric, more than 5 charactors.

additional, require one from `email` and `phone` fields: if you fill email, phone is optional, vice versa.

According to the rule aboved, We can define a rule as follow:

```javascript
  var rule = [
    'AND',
    'name',
    ['OR',
      ['RE', /^.+@.+$/, 'email'],
      ['RE', /^[0-9]+$/, 'phone'],
    ],
    ['RE', /^[0-9a-zA-Z]{5}[0-9a-zA-Z]+$/, 'password'],
  ]
```

pass a form element as the first argument:

```javascript
  function onSubmit(button, evt) {
    var form = document.getElementById('form')
    var ret = FormValidator.test(form, rule)
    console.log(JSON.stringify(ret))
  }
```

pass a dictionary as the first argument:

```javascript
  var ret = FormValidator.test(form, rule)
  console.log(JSON.stringify(ret))
```

## Rule specification

`rule` could be define as follow:

```
RULE := [ OP, ARGS ... ] | RE_RULE
RE_RULE := [ 'RE', RegExp, String]
OP := 'AND' | 'OR' | 'RE'
ARGS := String | RULE | RE_RULE
```

in which OP:

- AND: take one or more args, return true if all args are true
- OR: take one or more args, return false if all args are true
- RE: take two args, the first one should be a regex, the second should be a string, return regex.test(str)
