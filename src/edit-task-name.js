import { app } from './helper'
import { fromEvent, of } from 'rxjs'
import { bufferTime, bufferWhen, debounceTime, delay, filter, map, mapTo, merge, scan, switchMap } from 'rxjs/operators'

app.innerHTML = `
<div>
  <h1>
    任務名稱：<span id="task-name"></span>
  </h1>
  <i>敲打 edit 可以編輯任務哦！</i>
  <hr />
  <button id="edit">編輯</button>
  <div id="editing-control" style="display: none;">
    <input type="text" id="name" placeholder="請輸入任務名稱">
    <button id="cancel">取消</button>
    <button id="submit">確定</button>
  </div>
</div>
`

const DEdit = document.getElementById('edit')
const DEditingControl = document.getElementById('editing-control')
const DName = document.getElementById('name')
const DTaskName = document.getElementById('task-name')
const DCancel = document.getElementById('cancel')
const DSubmit = document.getElementById('submit')

const showDEdit = () => {
  DEdit.style.display = 'block'
  DEditingControl.style.display = 'none'
}

const hideDEdit = () => {
  DName.value = DTaskName.innerText
  DEditingControl.style.display = 'block'
  DEdit.style.display = 'none'
  DName.focus()
}

const inputNameEnter$ = fromEvent(DName, 'keyup')
  .pipe(
    filter(ev => ev.key === 'Enter')
  )

fromEvent(DEdit, 'click')
  .subscribe(hideDEdit)

fromEvent(DCancel, 'click')
  .subscribe(showDEdit)

fromEvent(DSubmit, 'click')
  .pipe(
    merge(inputNameEnter$)
  )
  .subscribe(() => {
    DTaskName.innerText = DName.value
    showDEdit()
  })

const keydown$ = fromEvent(document, 'keydown')
keydown$
  .pipe(
    map(ev => ev.key),
    bufferWhen(() => keydown$.pipe(
      filter(() => DEdit.style.display === '' || DEdit.style.display === 'block'),
      debounceTime(300),
    )),
    filter(ev => ev.join('') === 'edit')
  ).subscribe(hideDEdit)

export const editTaskName = null
