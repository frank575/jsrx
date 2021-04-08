import { filter, tap } from 'rxjs/operators'
import { app } from './helper'
import { combineLatest, defer, fromEvent, of } from 'rxjs'
import { switchMap } from 'rxjs/src/internal/operators/switchMap'

app.innerHTML = `
  <button id="refresh">refresh</button>
  <div id="pic"></div>
`

const DPic = app.querySelector('#pic')
const DRefresh = document.querySelector('#refresh')

const getDog$ = defer(() => fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json()))
const getCat$ = defer(() => fetch('https://api.thecatapi.com/v1/images/search').then(res => res.json()))

const switchResData = switchMap(() => combineLatest(getDog$, getCat$))
const innerWaiting = tap(() => DPic.innerHTML = `<h1>Waiting...</h1>`)
const innerImg = ([dogRes, catRes]) => {
  DPic.innerHTML = `
    <div>
      <img src="${dogRes.message}" alt="dog" style="max-width: 320px; max-height: 320px;">
      <img src="${catRes[0].url}" alt="cat" style="max-width: 320px; max-height: 320px;">
    </div>
  `
}

of(0).pipe(
  innerWaiting,
  switchResData
).subscribe(innerImg)

fromEvent(DRefresh, 'click').pipe(
  filter(() => DPic.innerText !== 'Waiting...'),
  innerWaiting,
  switchResData,
).subscribe(innerImg)

export const fetchDogAndCat = null
