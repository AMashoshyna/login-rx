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

let emailData = getStream(emailInputElement, 'blur')
    .map(event => event.target.value)
    .filter(value => value !== "")
    
let emailValid = getStream(emailInputElement, 'blur')  
    .map(event => event.target.value)
    .filter(value => value !== "")
    .map(validator.email)
    .do(val => {
      val? markValid(emailInputElement)
      : markInvalid(emailInputElement)
    })
let emailCorrectionValid = getStream(emailInputElement, 'keyup')
    .skipUntil(emailValid)
    .map(event => event.target.value)
    .filter(value => value !== "")
    .map(validator.email)
    .filter(val => val)
    .do(val => {
      val? markValid(emailInputElement)
      : markInvalid(emailInputElement)
    })
   
let passwordData = getStream(passwordInputElement, 'keyup')
    .map(event => event.target.value)
    .filter(value => value !== "")

let passwordValid = getStream(passwordInputElement, 'keyup')  
    .map(event => event.target.value)
    .filter(value => value !== "")
    .map(validator.password)
    .do(val => {
      val? markValid(passwordInputElement)
      : markInvalid(passwordInputElement)
    })
let email$ = emailValid.merge(emailCorrectionValid)

let elements = [emailInputElement, passwordInputElement]
elements.map(element => getStream(element, 'focus').subscribe(clean))


email$.combineLatest(passwordValid)
  .map(value => value.reduce((acc, next) => acc && next, true))
  .subscribe(enabled => enabled? enable(loginBtn) : disable(loginBtn))

emailData.combineLatest(passwordData)
  .sample(getStream(loginBtn, 'click'))
  .subscribe(value => console.log(`email: ${value[0]}, password: ${value[1]}`))


  