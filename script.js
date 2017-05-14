const loginBtn = getElement("login")
const emailEl = getElement("email")
const pwdEl = getElement("password")

const emailStream = getStream(emailEl, "blur").filter(
  event => event.target.value !== ""
)

const validMailSubscr = emailStream
  .filter(event => validateEmail(event.target.value))
  .subscribe(event => {
    markValid(event.target)
    emailStatus.next('valid')
  })

const invalidMailSubscr = emailStream
  .filter(event => !validateEmail(event.target.value))
  .subscribe(event => {
    markInvalid(event.target)
    showEmailInvalidWarning()
    emailStatus.next('invalid')
  })

const pwdStream = getStream(pwdEl, "blur")
  .filter(event => event.target.value !== "")

const subscrValidPwd = pwdStream
  .filter(event => validatePwd(event.target.value))
  .subscribe(event => {
    markValid(event.target)
    pwdLengthStatus.next('valid')
  })

  const subscrInvalidPwd = pwdStream
  .filter(event => !validatePwd(event.target.value))
  .subscribe(event => {
    markInvalid(event.target)
    showPwdLengthWarning()
    pwdLengthStatus.next('invalid')
  })

  const pwdTypeStream = getStream(pwdEl, 'keyup')
    .map(event => event.target.value.charAt(event.target.value.length-1))
  const subscrIllegalChars = pwdTypeStream  
  .filter(char => {
    const re = /[a-zA-Z0-9]/
    return !re.test(char)
  })
  .subscribe(char => {
    showPwdIllegalCharsWarning()
    pwdCharStatus.next('invalid')
  })

  const subscrNoIllegalChars = pwdTypeStream  
  .filter(char => {
    const re = /[a-zA-Z0-9]/
    return re.test(char)
  })
  .subscribe(char => {
    pwdCharStatus.next('valid')
  })



const focusMail = getStream(emailEl, "focus")
const focusPwd = getStream(pwdEl, "focus")
const subscrStartTypeMail = focusMail.subscribe(event => {
  clean(event)
})
const subscrStartTypePwd = focusPwd.subscribe(event => {
  clean(event)
})

const emailStatus = new Rx.BehaviorSubject(null)
emailStatus.subscribe(val => console.log(val))

const pwdLengthStatus = new Rx.BehaviorSubject(null)
pwdLengthStatus.subscribe(val => console.log(val))

const pwdCharStatus = new Rx.BehaviorSubject(null)
pwdCharStatus.subscribe(val => console.log('charstatus', val))

const bothFields = Rx.Observable.combineLatest(
  emailStream.map(event => event.target.value),
  pwdStream.map(event => event.target.value)
)

const subscrBothFields = bothFields.subscribe(values => {
  if (validateArray(values)) {
    enable(loginBtn)
  } else {
    console.log("Both fields must be valid")
  }
})

const subscrSuccessBothFields = Rx.Observable
.combineLatest(emailStatus, pwdLengthStatus)
.filter(statuses => {
  console.log('statuses', statuses)
  return statuses = ['valid', 'valid']
})
.withLatestFrom( Rx.Observable.combineLatest(
  emailStream.map(event => event.target.value),
  pwdStream.map(event => event.target.value)
))
.subscribe(val => console.log('both statuses', val))

// const subscrSuccess = subscrSuccessBothFields
// .switchMap(() => bothFields)
// .subscribe(val => console.log('both statuses', val))

const illegalCharWarningEl = getElement("pwd-illegal-chars-warning")
const illegalCharWarning$ = new Rx.BehaviorSubject(illegalCharWarningEl.hidden)

const syncWarning = new Rx.Observable.combineLatest(pwdCharStatus, illegalCharWarning$)
const syncWarningSubscr = syncWarning.subscribe(val => {
  const [illegalChars, warningStatus] = val;
  if(illegalChars === 'invalid' && warningStatus ) {
    illegalCharWarning$.next(false)
  } else if(illegalChars === 'valid' && !warningStatus) {
  illegalCharWarning$.next(true)
  }
console.log('combined', val)
}  
)


function validateArray(arr) {
  let result = arr.filter(item => item.length >= 5)
  console.log(result)
  if (result.length == 2) {
    return true
  }
  return false
}
