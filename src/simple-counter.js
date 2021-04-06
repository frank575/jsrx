import { empty, fromEvent, of } from 'rxjs'
import { app } from './helper'
import { mapTo, scan, merge, startWith } from 'rxjs/operators'

const counter = document.createElement('div')
const minusBtn = document.createElement('button')
const increaseBtn = document.createElement('button')
const count = document.createElement('span')

minusBtn.innerText = '-'
increaseBtn.innerText = '+'

counter.append(minusBtn)
counter.append(count)
counter.append(increaseBtn)
app.append(counter)

const minus$ = fromEvent(minusBtn, 'click').pipe(
  mapTo(-1)
)
const increase$ = fromEvent(increaseBtn, 'click').pipe(
  mapTo(1)
)
const count$ = of(0).pipe(
  merge(increase$, minus$),
  scan((p, e) => p + e, 0)
)
count$.subscribe(e => count.innerText = ` ${e} `)

export const simpleCounter = null
