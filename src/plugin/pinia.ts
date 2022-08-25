import { defineStore } from 'pinia'
import random from 'random'
import { calculateScore, floodFill } from '../core/floodFill'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export let useMainStore = defineStore('main', {
  // other options...
})

// Các trạng thái chọn màu trong chế độ 2 người chơi
export enum PickColorPhrase {
  RED_PLAYER_PICK,
  RED_PLAYER_BAN,
  BLUE_PLAYER_PICK,
  BLUE_PLAYER_BAN,
}

// Các kết quả của 1 ván.
export enum GameResult {
  RED_PLAYER_WIN,
  BLUE_PLAYER_WIN,
  DRAW
}

export let useGameStore = defineStore('game', {
  state: () => {
    return {
      boardSize: 15,
      numberOfColors: 6,
      allowBanColor: false,
      playWithComputer: false,
      bannedNumber: -1,
      playerRedScore: 1,
      playerBlueScore: 1,
      boardCurrentState: [[1, 2], [3, 4]],
      pickColorPhrase: PickColorPhrase.RED_PLAYER_PICK
    }
  },
  getters: {
    isRedTurn(): boolean {
      return this.pickColorPhrase == PickColorPhrase.RED_PLAYER_PICK 
      || this.pickColorPhrase == PickColorPhrase.RED_PLAYER_BAN
    },
    isGameFinished(): boolean {
      return this.playerRedScore + this.playerBlueScore == this.boardSize*this.boardSize
    },
    winningTeam(): GameResult {
      let value: GameResult = GameResult.DRAW
      if(this.isGameFinished) {
        if(this.playerRedScore > this.playerBlueScore) {
          value = GameResult.RED_PLAYER_WIN
        } else if(this.playerRedScore < this.playerBlueScore) {
          value = GameResult.BLUE_PLAYER_WIN
        } else {
          value = GameResult.DRAW
        }
      }
      return value
    },
    getRedCurrentNumber(): number {
      return this.boardCurrentState[0][0]
    },
    getBlueCurrentNumber(): number {
      return this.boardCurrentState[this.boardSize - 1][this.boardSize - 1]
    }
  },
  actions: {
    initBoard() {
      let boardState: number[][] = []
      for(let i: number = 0; i < this.boardSize; i++) {
          boardState[i] = []
          for(let j: number = 0; j < this.boardSize; j++) {
              boardState[i][j] = random.int(0, this.numberOfColors - 1)
          }
      }
      this.boardCurrentState = boardState
    },
    updateBoardAndScore(newNumber: number) {
      if(this.isRedTurn) {
        this.boardCurrentState = floodFill(
          this.boardCurrentState,
          this.boardSize, this.boardSize,
          0, 0, 
          this.getRedCurrentNumber, newNumber
        )
        this.playerRedScore = calculateScore(
          this.boardCurrentState,
          this.boardSize, this.boardSize,
          0, 0,
          newNumber
        )
      } else {
        this.boardCurrentState = floodFill(
          this.boardCurrentState,
          this.boardSize, this.boardSize,
          this.boardSize - 1, this.boardSize - 1, 
          this.getBlueCurrentNumber, newNumber
        )
        this.playerBlueScore = calculateScore(
          this.boardCurrentState,
          this.boardSize, this.boardSize,
          this.boardSize - 1, this.boardSize - 1, 
          newNumber
        )
      }
    }
  }
})
