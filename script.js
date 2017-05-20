const loginBtn = getElement("login")
const emailEl = getElement("email")
const pwdEl = getElement("password")

const email =  getStream(emailEl, "blur")
.filter(event => event.target.value !== "")
.map(event => {
  console.log(event);
  return isInvalidEmail(event)
})
.filter(event => validateEmail(event.target.value))

const password = getStream(pwdEl, "keyup")
.filter(event => event.target.value !== "")
.map(event => 
 { 
return isInvalid(event)
})
.filter(event => validatePwd(event.target.value)).combineLatest(email)

password.subscribe(event => {
  enable(loginBtn)
})

const login = getStream(loginBtn, "click")
.combineLatest(password)
.subscribe(val => console.log(val[1][0].target.value, val[1][1].target.value))
