const emailInvalidWarning = getElement('email-invalid-warning')
const pwdLengthWarning = getElement('pwd-length-warning')
const pwdIllegalCharsWarning = getElement('pwd-illegal-chars-warning')
function getElement(elem) { return document.getElementById(elem) } 

function getStream(elem, event){
    return Rx.Observable.fromEvent(elem, event)
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateChar(char) {
    const re = /^[a-zA-Z0-9]*$/
    return re.test(char)
}

function validatePwd(str) {
    return validateChar(str) && (str.length >= 5)
}
function isInvalidEmail(event) {
    let email = event.target.value
    if(!validateEmail(email)){
        markInvalid(event.target)
    } else {
        unmarkInvalid(event.target)
        markValid(event.target)
    }
    return event
}
function isInvalid(event) {
    let pwd = event.target.value
    if(!validateChar(pwd)) {
        markInvalid(pwdEl)
    } else {
        unmarkInvalid(event.target)
        markValid(pwdEl)
    }

    return event
}
function disable(btn) {
    btn.setAttribute("disabled", "")
}
function enable(btn) {
     btn.removeAttribute("disabled")
}


function markInvalid(elem) {
elem.classList.add("invalid")
}

function unmarkInvalid(elem) {
  elem.classList.remove("invalid")
}

function markValid(elem) {
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

function clean(event) {
  event.target.classList.remove("invalid")
  event.target.classList.remove("valid")
  if(event.target.id ==='email') {
  emailInvalidWarning.classList.add('hidden')
  } else if(event.target.id ==='password') {
      pwdIllegalCharsWarning.classList.add('hidden')
      pwdLengthWarning.classList.add('hidden')
  }
}