// import { interval, fromEvent, combineLatest, BehaviorSubject } from 'rxjs';
// import { scan, startWith, map, takeWhile, switchMap } from 'rxjs/operators';
//
// const randomLetter = () => String.fromCharCode(
//   Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0));
// const levelChangeThreshold = 20;
// const speedAdjust = 50;
// const endThreshold = 15;
// const gameWidth = 30;
//
// const intervalSubject = new BehaviorSubject(600);
//
// const letters$ = intervalSubject.pipe(
//   switchMap(i => interval(i)
//     .pipe(
//       scan((letters) => ({
//       intrvl: i,
//       ltrs: [({
//         letter: randomLetter(),
//         yPos: Math.floor(Math.random() * gameWidth)
//       }), ...letters.ltrs]
//     }), { ltrs: [], intrvl: 0 })
//     )));
//
// const keys$ = fromEvent(document, 'keydown')
//   .pipe(
//     startWith({ key: '' }),
//     map((e) => e.key)
//   );
//
// const renderGame = (state) => (
//   document.body.innerHTML = `Score: ${state.score}, Level: ${state.level} <br/>`,
//     state.letters.forEach(l => document.body.innerHTML +=
//       '&nbsp'.repeat(l.yPos) + l.letter + '<br/>'),
//     document.body.innerHTML +=
//       '<br/>'.repeat(endThreshold - state.letters.length - 1) + '-'.repeat(gameWidth)
// );
// const renderGameOver = () => document.body.innerHTML += '<br/>GAME OVER!';
// const noop = () => { };
//
// const game$ = combineLatest(keys$, letters$).pipe(
//   scan((state, [key, letters]) => (
//   letters.ltrs[letters.ltrs.length - 1]
//   && letters.ltrs[letters.ltrs.length - 1].letter === key
//     ? (state.score = state.score + 1, letters.ltrs.pop())
//     : noop,
//     state.score > 0 && state.score % levelChangeThreshold === 0
//       ? (
//         letters.ltrs = [],
//           state.level = state.level + 1,
//           state.score = state.score + 1,
//           intervalSubject.next(letters.intrvl - speedAdjust))
//       : noop,
//     ({ score: state.score, letters: letters.ltrs, level: state.level })),
//   { score: 0, letters: [], level: 1 }),
//   takeWhile(state => state.letters.length < endThreshold),
// )
//
// game$.subscribe(
//   renderGame,
//   noop,
//   renderGameOver
// );
//
//

import { app } from './helper'
import { BehaviorSubject, combineLatest, fromEvent, interval } from 'rxjs'
import { pluck, scan, startWith, takeWhile } from 'rxjs/operators'
import { switchMap } from 'rxjs/src/internal/operators/switchMap'

// https://www.learnrxjs.io/learn-rxjs/recipes/alphabet-invasion-game
app.innerHTML += `
  <img src="https://drive.google.com/uc?export=view&id=1huQHQFCmfdKPbh7ayjzJOOd1leVAY7Pi" alt="" style="position: fixed;right:0;top:0;width:800px;">
  <div id="game"></div>
`

const gameWidth = 30
const levelRange = 20
const lineHeight = 15

const DGame = document.getElementById('game')

const renderGame = state => {
  DGame.innerHTML = `Score: ${state.score}, Level: ${state.level}<br />`
  state.letters.forEach((el, i) => {
    const { yPos, letter } = state.letters[i]
    DGame.innerHTML += `${'&nbsp;'.repeat(yPos)}${letter}${'&nbsp;'.repeat(gameWidth - yPos)}<br />`
  })
  DGame.innerHTML += `${'<br />'.repeat(lineHeight - state.letters.length)}${'-'.repeat(gameWidth)}`
}

const randomLetter = () =>
  String.fromCharCode(
    Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0)
  )

const renderGameOver = () => {
  DGame.innerHTML += `<br/> GameOver! <button id="restart">重新開始</button>`
  document.getElementById('restart').onclick = ev => {
    startGame()
    ev.target.style.display = 'none'
  }
}

const levelSubject = new BehaviorSubject(1)

const letters$ = levelSubject.pipe(
  switchMap(level => interval(1000 - level * 200).pipe(
    scan(letters => [{ yPos: Math.floor(Math.random() * gameWidth), letter: randomLetter() }, ...letters], [])
  ))
)

const keys$ = fromEvent(document, 'keydown').pipe(
  startWith({ key: '' }),
  pluck('key'),
)

const game$ = combineLatest(keys$, letters$).pipe(
  scan((state, [key, letters]) => {
    const lastLetter = letters[letters.length - 1]
    let { level, score } = state
    if (key === lastLetter.letter) {
      letters.pop()
      if (++score > 0 && score % levelRange === 0) {
        letters.length = 0
        levelSubject.next(++level)
      }
    }
    return { score, level, letters }
  }, { score: 0, level: 1, letters: [] }),
  takeWhile(({letters}) => letters.length < lineHeight + 1)
)

const startGame = () => game$.subscribe(
  renderGame,
  () => {},
  renderGameOver
)

startGame()

export const alphabetInvasion = null
