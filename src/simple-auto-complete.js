import { app } from './helper'
import { fromEvent } from 'rxjs'
import { debounceTime, filter, merge, tap } from 'rxjs/operators'

const data = []
const keywords = 'abcdefglijklmnopqrstuvwxyz1234657980'
for (let i = 0; i < 200; i++) {
  let text = ''
  for (let j = 0; j < Math.floor(Math.random() * 4 + 8); j++) {
    const index = Math.floor(Math.random() * keywords.length)
    text += keywords[index]
  }
  data.push(text)
}

const wrap = document.createElement('div')
const searchInput = document.createElement('input')
const btn = document.createElement('button')
const list = document.createElement('ul')

searchInput.placeholder = `請輸入關鍵字`
btn.innerText = `查詢`
wrap.append(searchInput)
wrap.append(btn)
wrap.append(list)
app.append(wrap)

let keyword = ''
const render = () => list.innerHTML = data.filter(e => e.includes(keyword)).map(e => `<li>${e}</li>`).join('')
const enter$ = fromEvent(searchInput, 'keydown').pipe(
  filter(e => e.key === 'Enter')
)
const input$ = fromEvent(searchInput, 'input')
const clickSearch$ = fromEvent(btn, 'click')

input$.pipe(
  merge(enter$, clickSearch$),
  tap(e => keyword = e.target.value),
  debounceTime(500),
).subscribe(() => {
  render()
})

export const simpleAutoComplete = null
