import { app } from './helper'
import { fromEvent, of } from 'rxjs'
import { delay, map, switchMap, takeUntil, tap } from 'rxjs/operators'

const dragDom = document.createElement('div')
dragDom.id = 'drag'
app.append(dragDom)

const mousedown$ = fromEvent(dragDom, 'mousedown')
const mousemove$ = fromEvent(document, 'mousemove')
const mouseup$ = fromEvent(document, 'mouseup')

mousedown$.pipe(
  switchMap(e => {
    return of(e)
      .pipe(
        delay(200),
        takeUntil(mousemove$)
      )
  }),
  switchMap(e => {
    const initialOffsetX = e.offsetX
    const initialOffsetY = e.offsetY
    return mousemove$.pipe(
      map(e => ({
        x: e.clientX - initialOffsetX,
        y: e.clientY - initialOffsetY,
      })),
      takeUntil(mouseup$.pipe(
        tap(e => console.log(e.target))
      ))
    )
  }),
).subscribe(pos => {
  dragDom.style.left = `${pos.x}px`
  dragDom.style.top = `${pos.y}px`
})

export const delayDrag = null
