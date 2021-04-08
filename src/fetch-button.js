import { app } from './helper'
import { fromEvent } from 'rxjs'
import { concatMap, filter, tap } from 'rxjs/operators'

const img = document.createElement('img')
const fetchBtn = document.createElement('button')
const wrap = document.createElement('div')
fetchBtn.innerText = `fetch~!`
wrap.append(fetchBtn)
wrap.append(img)
app.append(wrap)

const fetchDogUrl = () => new Promise(resolve => {
  setTimeout(async () => {
    const response = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json())
    resolve(response.message)
  }, 1000)
})

const click$ = fromEvent(fetchBtn, 'click')
  .pipe(
    filter(e => e.target.innerText !== `wait...`),
    tap(e => e.target.innerText = `wait...`),
    concatMap(fetchDogUrl),
  )

click$.subscribe(url => {
  fetchBtn.innerText = `fetch~!`
  img.src = url
})

export const fetchButton = null
