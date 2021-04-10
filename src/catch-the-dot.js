import { app } from './helper'
import { fromEvent, interval } from 'rxjs'
import { finalize, scan, switchMap, tap } from 'rxjs/operators'
import { takeWhile } from 'rxjs/src/internal/operators/takeWhile'

export const catchTheDot = null

let gameState = {}
const initialGameState = () => {
  gameState = {
    boardSize: 500,
    ballSize: 50,
    ballRgb: [255, 255, 255],
    countdown: 5,
    score: 0,
  }
}
initialGameState()

const dotScore = document.createElement('div')
const dot = document.createElement('div')
dot.style.cssText = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${gameState.ballSize}px;
  height: ${gameState.ballSize}px;
  background: rgba(${gameState.ballRgb.join(', ')}, .8);
  position: absolute;
  left: 60px;
  top: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: .4s ease;
`
dotScore.style.cssText = `
  font-size: 14px;
  background: none;
  color: #000;
`

const board = document.createElement('div')
board.style.cssText = `
  position: relative;
  width: ${gameState.boardSize}px;
  height: ${gameState.boardSize}px;
  border: 1px solid rgba(255, 255, 255, .5);
`

const countdown = document.createElement('em')
countdown.style.cssText = `
  width: 100%;
  user-select: none;
  pointer-events: none;
  font-size: 48px;
  text-align: center;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, .5);
`
countdown.innerText = `${gameState.countdown}`

dot.append(dotScore)
board.append(countdown)
board.append(dot)
app.append(board)

const generatePos = () => {
  const r = Math.floor(Math.random() * gameState.boardSize)
  return r + gameState.ballSize > gameState.boardSize ?
    gameState.boardSize - gameState.ballSize :
    r
}

const randomColor = () => Math.floor(Math.random() * 100) + 155

const moveDot = () => {
  const x = generatePos(), y = generatePos()
  if (gameState.ballSize > 25) {
    gameState.ballSize -= 2.5
  }
  gameState.ballRgb = [randomColor(), randomColor(), randomColor()]
  dot.style.width = `${gameState.ballSize}px`
  dot.style.height = `${gameState.ballSize}px`
  dot.style.background = `rgba(${gameState.ballRgb.join(', ')}, .8)`
  dot.style.left = `${x}px`
  dot.style.top = `${y}px`
}

const renderDotScore = score => dotScore.innerText = `${score}`

const renderCountdown = (time) => countdown.innerText = `${time}`

const renderGameOver = () => countdown.innerHTML = `GameOver!<br/>YourScore: ${gameState.score}`

const game$ = fromEvent(dot, 'click').pipe(
  scan(() => ++gameState.score, gameState.score),
  tap(renderDotScore),
  tap(moveDot),
  tap(() => renderCountdown(gameState.countdown)),
  switchMap(() => {
    return interval(500).pipe(
      scan(time => time - 1, gameState.countdown),
      tap(renderCountdown),
    )
  }),
  takeWhile(time => time > 0),
  finalize(() => {
    renderGameOver()
    initialGameState()
    game$.subscribe()
  })
)

game$.subscribe()
