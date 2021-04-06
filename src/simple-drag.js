import { fromEvent } from 'rxjs'
import { map, takeUntil, withLatestFrom } from 'rxjs/operators'
import { concatAll } from 'rxjs/src/internal/operators/concatAll'
import { app } from './helper'

const dragDom = document.createElement('div')
dragDom.id = 'drag'
app.append(dragDom)

const mousedown$ = fromEvent(dragDom, 'mousedown')
const mousemove$ = fromEvent(document, 'mousemove')
const mouseup$ = fromEvent(document, 'mouseup')

mousedown$.pipe(
  map(() => mousemove$.pipe(takeUntil(mouseup$))),
  concatAll(),
  withLatestFrom(mousedown$, (move, down) => ({
    x: move.clientX - down.offsetX,
    y: move.clientY - down.offsetY,
  })),
).subscribe(pos => {
  dragDom.style.left = pos.x + 'px'
  dragDom.style.top = pos.y + 'px'
})

export const simpleDrag = null
