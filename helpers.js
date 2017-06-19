const emailInvalidWarning = getElement('email-invalid-warning')
const pwdLengthWarning = getElement('pwd-length-warning')
const pwdIllegalCharsWarning = getElement('pwd-illegal-chars-warning')
const spinner = getElement("spinner")
const loginSuccess = getElement("login-success")
const loginFailure = getElement("login-failure")
function getElement(elem) { return document.getElementById(elem) } 

function getStream(elem, event){
    return Rx.Observable.fromEvent(elem, event)
}
function getValueStream(elem, event) {
    return getStream(elem, event)
    .map(event => event.target.value)
    .filter(value => value !== "")
}

function disable(btn) {
    btn.setAttribute("disabled", "")
}
function enable(btn) {
     btn.removeAttribute("disabled")
}


function markInvalid(elem) {
    elem.classList.remove("valid")
elem.classList.add("invalid")
}

function unmarkInvalid(elem) {
  elem.classList.remove("invalid")
}

function markValid(elem) {
  elem.classList.remove("invalid")
  elem.classList.add("valid")
}

 function showEmailInvalidWarning() {
   emailInvalidWarning.classList.remove('hidden')
 }
 function showPwdLengthWarning () {
     pwdLengthWarning.classList.remove('hidden')
 }
 function showPwdIllegalCharsWarning() {
     pwdIllegalCharsWarning.classList.remove('hidden')
 }

function clean(element) {
  element.classList.remove("invalid")
  element.classList.remove("valid")
  if(element.id ==='email') {
  emailInvalidWarning.classList.add('hidden')
} else if(element.id ==='password') {
      pwdIllegalCharsWarning.classList.add('hidden')
      pwdLengthWarning.classList.add('hidden')
  }
}

function hideSpinner() {
    spinner.classList.add('hidden')
}

function showSpinner() {
    spinner.classList.remove('hidden')
}

function showLoginSuccess(user) {
    loginSuccess.innerHTML = `You are logged in as ${user}`
    loginSuccess.classList.remove('hidden')
    inputs.forEach(element => {
        element.setAttribute("disabled", "")
        element.value = ""
        clean(element)
    })
}

function showLoginFailure() {
    loginFailure.classList.remove('hidden')
    passwordInputElement.value = ""
    inputs.forEach(clean)
}
function hideLoginStatus() {
    loginSuccess.classList.add('hidden')
    loginFailure.classList.add('hidden')
}