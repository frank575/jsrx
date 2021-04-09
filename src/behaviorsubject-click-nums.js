import { app } from './helper'
import { BehaviorSubject, fromEvent, merge, timer } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { mergeMap } from 'rxjs/src/internal/operators/mergeMap'

app.innerHTML = `
  interval value is:<br>
  <div id="intervalValue"></div>
  點擊畫面添加更多的 subscribes!
`

const addSubDom = state => document.body.innerHTML += `
  <div 
    id=${state.id}
    style="
      position: absolute;
      height: 30px;
      width: 30px;
      text-align: center;
      top: ${state.y}px;
      left: ${state.x}px;
      background: rgba(255,255,255,.3);
      border-radius: 80%;
      display: flex;
      align-items: center;
      justify-content: center;
    "
    >
  </div>`;

const subject = new BehaviorSubject(0)

const updateEl = id => v => document.getElementById(id).innerText = v.toString()

const click$ = fromEvent(document, 'click').pipe(
  map(ev => ({id: Math.random(), x: ev.x, y: ev.y})),
  tap(addSubDom),
  mergeMap(state => subject.pipe(
    tap(updateEl(state.id))
  ))
)

const timer$ = timer(0, 1000).pipe(
  tap(v => subject.next(v)),
  tap(updateEl('intervalValue')),
)

merge(click$, timer$).subscribe()


export const behaviorsubjectClickNums = null
