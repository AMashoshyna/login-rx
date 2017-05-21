const loginBtn = getElement("login")
const emailInputElement = getElement("email")
const passwordInputElement = getElement("password")

const validator = {
  email: function(str) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(str)
  },
  password: function(char) {
    const re = /^[a-zA-Z0-9]*$/
    return re.test(char)
  }
}

function setUpStream(input, eventType, validator) {
  let data = getStream(input, eventType)
    .map(event => event.target.value)
    .filter(value => value !== "")
  let valid = data.map(validator)
  return { data: data, valid: valid }
}


let email = setUpStream(emailInputElement, 'blur', validator.email)
let password = setUpStream(passwordInputElement, 'keyup', validator.password)

let arr = [email, password]
arr.map(input => input.valid)
  .forEach(valid => valid 
    ? markValid(emailInputElement) 
    : markInvalid(emailInputElement))

email.valid.combineLatest(password.valid)
  .map(value => value.reduce((acc, next) => acc && next, true))
  .subscribe(enabled => enabled? enable(loginBtn) : disable(loginBtn))

email.data.combineLatest(password.data)
  .sample(getStream(loginBtn, 'click'))
  .subscribe(value => console.log(`email: ${value[0]}, password: ${value[1]}`))
  