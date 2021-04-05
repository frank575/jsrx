import { fromEvent, interval, Subject } from 'rxjs'
import { map, take, takeUntil } from 'rxjs/operators'
import './style.css'
import { concatAll } from 'rxjs/src/internal/operators/concatAll'

const app = document.querySelector('#app')
app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`


const dragDom = document.createElement('div')
dragDom.id = 'drag'
app.append(dragDom)

const mousedown$ = fromEvent(dragDom, 'mousedown')
const mousemove$ = fromEvent(document, 'mousemove')
const mouseup$ = fromEvent(document, 'mouseup')

mousedown$.pipe(
  map(() => mousemove$.pipe(takeUntil(mouseup$))),
  concatAll(),
  map(e => ({x: e.clientX, y: e.clientY})),
).subscribe(pos => {
  dragDom.style.left = pos.x + 'px'
  dragDom.style.top = pos.y + 'px'
})
