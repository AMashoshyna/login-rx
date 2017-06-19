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

let emailData = getValueStream(emailInputElement, 'blur')
    
let emailValid = emailData 
    .map(validator.email)
    .do(val => {
      val? markValid(emailInputElement)
      : markInvalid(emailInputElement)
    })
let emailCorrectionValid = getValueStream(emailInputElement, 'keyup')
    .skipUntil(emailValid)
    .map(validator.email)
    .filter(val => val)
    .do(val => {
      val? markValid(emailInputElement)
      : markInvalid(emailInputElement)
    })
   
let passwordData = getValueStream(passwordInputElement, 'keyup')

let passwordValid = getValueStream(passwordInputElement, 'keyup')  
    .map(value => {
      return {
        password: value,
        valid: validator.password(value)
        }
      })
      .do(passwordObj => !passwordObj.valid? markInvalid(passwordInputElement): null)
      .filter(passwordObj => passwordObj.valid)
    .do(passwodrObj => {
      passwodrObj.password.length >= 3 ? markValid(passwordInputElement)
      : null
    })
let email$ = emailValid.merge(emailCorrectionValid)

let inputs = [emailInputElement, passwordInputElement]
inputs.map(element => 
  getStream(element, 'focus')
  .map(event => event.target)
  .subscribe(clean))

let allControls =  [emailInputElement, passwordInputElement, loginBtn]
allControls.map(element => 
  getStream(element, 'click')
  .subscribe(hideLoginStatus))

email$.combineLatest(passwordValid)
  .map(value => value.reduce((acc, next) => acc && next, true))
  .subscribe(enabled => enabled? enable(loginBtn) : disable(loginBtn))

emailData.combineLatest(passwordData)
  .map(([email, password]) => {
    return {email: email, password: password}
  })
  .sample(getStream(loginBtn, 'click'))
  .do(showSpinner)
  .flatMap(data => Rx.Observable.fromPromise(sendData(data).then(data => showLoginSuccess(data.email), err => showLoginFailure())).do(hideSpinner))
  .subscribe()

  function sendData(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if(Math.random()<0.5) {
          resolve(data)
        } else {
          reject('Badluck, login failed')
        }
      }, 1000)
    })
  }
const usersUrl = 'http://localhost:8080/users.json'
let usersRequest$ = Rx.Observable.of(usersUrl)
usersRequest$.subscribe(url => {
  let userResponse$ = Rx.Observable.fromPromise(getData(url)).map(JSON.stringify).subscribe(console.log)
})

  