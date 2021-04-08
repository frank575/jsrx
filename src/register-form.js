import { app } from './helper'
import { fromEvent } from 'rxjs'
import { map, mapTo, merge } from 'rxjs/operators'

app.innerHTML = `
  <div class="register-form">
    <div class="input-layout">
      <div class="label">使用者名稱</div>
      <div class="input">
        <input type="text" id="account" />
      </div>
    </div>
    <div class="input-layout">
      <div class="label">密碼</div>
      <div class="input">
        <input type="password" id="password" />
      </div>
    </div>
    <div class="input-layout">
      <div class="label">二次密碼</div>
      <div class="input">
        <input type="password" id="check-password" />
      </div>
    </div>
    <div class="submit">
      <button id="submit">送出</button>
    </div>
    <div id="store-value" />
  </div>
`
const proxyStore = new Proxy({
  account: '',
  password: '',
  checkPassword: '',
}, {
  set (target, key, value) {
    target[key] = value
    document.querySelector('#store-value').innerText = JSON.stringify(target)
    return true
  }
})
document.querySelector('#store-value').innerText = JSON.stringify(proxyStore)

const accountDom = document.querySelector('#account')
const passwordDom = document.querySelector('#password')
const checkPasswordDom = document.querySelector('#check-password')
const submitDom = document.querySelector('#submit')

const commonInputPipe = (observable, key) => observable.pipe(
  map(ev => ({ value: ev.target.value, key }))
)
const accountEvent$ = commonInputPipe(fromEvent(accountDom, 'input'), 'account')
const passwordEvent$ = commonInputPipe(fromEvent(passwordDom, 'input'), 'password')
const checkPasswordEvent$ = commonInputPipe(fromEvent(checkPasswordDom, 'input'), 'checkPassword')

accountEvent$.pipe(
  merge(passwordEvent$, checkPasswordEvent$)
).subscribe(({ key, value }) => {
  proxyStore[key] = value
})

const submit$ = fromEvent(submitDom, 'click')
const sameAsPassword = store => store.password === store.checkPassword ? undefined : '二次密碼必須相同'
const passwordMoreThanSevenText = store => store.password.length > 7 ? undefined : '密碼需大於七個字'
const accountMoreThanSevenText = store => store.account.length > 7 ? undefined : '使用者名稱需大於七個字'
const submitValidate = store => {
  console.log(store)
  const errors = []
  const errMap = {
    a: sameAsPassword(store),
    b: passwordMoreThanSevenText(store),
    c: accountMoreThanSevenText(store),
  }
  for (let key in errMap) {
    if (errMap[key]) {
      errors.push(errMap[key])
    }
  }
  return errors
}

submit$.pipe(
  mapTo(proxyStore),
).subscribe((store) => {
  const validate = submitValidate(store)
  if (validate.length) {
    return alert(validate)
  }
  alert('帳號建立成功')
  for (let key in proxyStore) {
    proxyStore[key] = ''
  }
  accountDom.value = ''
  passwordDom.value = ''
  checkPasswordDom.value = ''
})

export const registerForm = null
