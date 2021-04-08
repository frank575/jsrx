import { app } from './helper'
import { fromEvent } from 'rxjs'
import { combineLatest, map } from 'rxjs/operators'

app.innerHTML = `
<div class="bmi">
  <input type="text" id="height" /> cm
  <br />
  <input type="text" id="kg" /> kg
  <br />
  <h1>
    BMI：
    <i id="result">0</i>
  </h1>
</div>
`

const DKg = document.getElementById('kg')
const DHeight = document.getElementById('height')
const DResult = document.getElementById('result')

const inputKg$ = fromEvent(DKg, 'input').pipe(map(e => e.target.value * 1))
const inputHeight$ = fromEvent(DHeight, 'input').pipe(map(e => Math.pow(e.target.value / 100, 2)))
inputKg$.pipe(
  combineLatest(inputHeight$)
).subscribe(([kg, m2]) => {
  DResult.innerText = String((kg / m2).toFixed(2))
})


export const bmi = null
