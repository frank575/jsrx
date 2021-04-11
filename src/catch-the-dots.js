import { app } from './helper'
import { BehaviorSubject, fromEvent, interval } from 'rxjs'
import { finalize, scan, switchMap, tap } from 'rxjs/operators'
import { takeWhile } from 'rxjs/src/internal/operators/takeWhile'

export const catchTheDots = null

let gameState = {}
const generatePos = () => {
  const r = Math.floor(Math.random() * gameState.boardSize)
  return r + gameState.dotSize > gameState.boardSize ?
    gameState.boardSize - gameState.dotSize :
    r
}
const initialGameState = () => {
  gameState = {
    boardSize: 500,
    dotSize: 50,
    dotRgb: [255, 255, 255],
    dotPos: { x: 0, y: 0 },
    countdown: 5,
    score: 0,
    level: 1,
  }
  gameState.dotPos.x = generatePos()
  gameState.dotPos.y = generatePos()
}
initialGameState()

const createDot = () => {
  const dotScore = document.createElement('div')
  const dot = document.createElement('div')
  dot.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${gameState.dotSize}px;
    height: ${gameState.dotSize}px;
    background: rgba(${gameState.dotRgb.join(', ')}, .8);
    position: absolute;
    left: ${gameState.dotPos.x}px;
    top: ${gameState.dotPos.y}px;
    border-radius: 50%;
    cursor: pointer;
    transition: .4s ease;
  `
    dotScore.style.cssText = `
    font-size: 14px;
    background: none;
    color: #000;
  `
  dot.append(dotScore)
  return [dot, dotScore]
}

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

board.append(countdown)
app.append(board)


const randomColor = () => Math.floor(Math.random() * 100) + 155

const updateDotState = () => {
  gameState.dotPos.x = generatePos()
  gameState.dotPos.y = generatePos()
  gameState.dotRgb = [randomColor(), randomColor(), randomColor()]
  if (gameState.dotSize > 25) {
    gameState.dotSize -= 2.5
  }
}

const moveDot = (dot) => {
  updateDotState()
  dot.style.width = `${gameState.dotSize}px`
  dot.style.height = `${gameState.dotSize}px`
  dot.style.background = `rgba(${gameState.dotRgb.join(', ')}, .8)`
  dot.style.left = `${gameState.dotPos.x}px`
  dot.style.top = `${gameState.dotPos.y}px`
}

const renderDotScore = (dotScore, score) => dotScore.innerText = `${score}`

const renderCountdown = (time) => countdown.innerText = `${time}`

const renderGameOver = () => countdown.innerHTML = `GameOver!<br/>YourScore: ${gameState.score}`

const levelSubject = new BehaviorSubject(gameState.level)

const game$ = levelSubject.pipe(
  switchMap(level => {
    for (let i = 0; i < level; i++) {
      const [dot, dotScore] = createDot()
      board.append(dot)
    }
    return fromEvent(dot, 'click').pipe(
      scan(() => ++gameState.score, gameState.score),
      tap(score => renderDotScore(dotScore, score)),
      tap(() => moveDot(dot)),
      tap(() => renderCountdown(gameState.countdown)),
      switchMap(() => {
        return interval(500).pipe(
          scan(time => time - 1, gameState.countdown),
          tap(renderCountdown),
        )
      }),
      takeWhile(time => time > 0),
      finalize(() => {
        dot.remove()
        renderGameOver()
        initialGameState()
        game$.subscribe()
      })
    )
  })
)
game$.subscribe()
