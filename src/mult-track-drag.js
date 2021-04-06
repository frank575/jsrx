import { app } from './helper'
import { from, fromEvent, interval, of } from 'rxjs'
import { zip, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators'

const bgColors = ['pink', 'blue', 'red', 'orange']
bgColors.forEach(e => {
  const dragDom = document.createElement('div')
  dragDom.className = 'drag--track drag small'
  dragDom.style.background = e
  dragDom.style.pointerEvents = 'none'
  app.append(dragDom)
})

const dragDom = document.createElement('div')
dragDom.id = 'drag'
dragDom.className = 'drag small'
dragDom.style.background = 'yellow'
app.append(dragDom)

const mousedown$ = fromEvent(dragDom, 'mousedown')
const mousemove$ = fromEvent(document, 'mousemove')
const mouseup$ = fromEvent(document, 'mouseup')
const delayBoxes$ = from(document.querySelectorAll('.drag--track')).pipe(
  zip(interval(100), dragDom => dragDom)
)

mousedown$.pipe(
  switchMap(e => {
    const initialOffsetX = e.offsetX
    const initialOffsetY = e.offsetY
    return mousemove$.pipe(
      map(e => ({
        x: e.clientX - initialOffsetX,
        y: e.clientY - initialOffsetY,
      })),
      tap(pos => {
        dragDom.style.left = `${pos.x}px`
        dragDom.style.top = `${pos.y}px`
      }),
      takeUntil(mouseup$.pipe(
        tap(e => console.log(e.target))
      )),
    )
  }),
  mergeMap(pos => {
    return delayBoxes$.pipe(
      tap((dragDom) => {
        dragDom.style.left = `${pos.x}px`
        dragDom.style.top = `${pos.y}px`
      })
    )
  }),
).subscribe()

export const multTrackDrag = null
