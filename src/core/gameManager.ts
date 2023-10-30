import { computed, onMounted, ref, watch } from "vue";
import { ColorBoardManagerParams, useColorBoardManager } from "./colorBoardManager";
import { getStartPosition } from "./startPosition";

export let useGameManager = (params: ColorBoardManagerParams) => {
    let {boardSize, numColor, playerList, randomObstacle} = params
    let colorBoard = useColorBoardManager(params)
    let currentPlayerNum: number = 0
    let playerScore = ref([0, 0])

    let playerColor = computed(() => {
        let boardSize = colorBoard.boardSize
        let startPos = getStartPosition(boardSize, "corner", playerList)
        console.log(startPos)
        return startPos.map((pos: number[]): number => {
            return colorBoard.gameBoard.value[pos[0]][pos[1]].color
        })
    })
    let isGameFinished = ref(false)

    onMounted(() => {
        playerScore.value = new Array<number>(playerList.length)
        for(let i=0; i < playerList.length; i++) {
            playerScore.value[i] = 0
        }
        // Đánh dấu các ô xuất phát của người chơi.
        let startPos = getStartPosition(boardSize, "corner", playerList)
        startPos.forEach((pos: number[], index: number) => {
            let startCell = colorBoard.gameBoard.value[pos[0]][pos[1]]
            // active ô này, nếu ô bị disable:
            startCell.active = true
            startCell.score = 1
            startCell.owner = playerList[index]
            startCell.init = true
            colorBoard.floodFill(playerList[index], startCell.color)
        })
    })

    let nextPlayer = () => {
        if (currentPlayerNum >= playerList.length - 1) {
            currentPlayerNum = 0
        } else {
            currentPlayerNum++
        }
    }

    let playerMove = (newColor: number) => {
        let player = playerList[currentPlayerNum]
        colorBoard.floodFill(player, newColor)
        playerScore.value[currentPlayerNum] = colorBoard.calculateScore(player)
        nextPlayer()
        console.log(`Current player: ${currentPlayerNum}`)
        isGameFinished.value = isGameFinishedFunc()
    }

    let isGameFinishedFunc = () => {
        let result = true
        playerList.forEach((player) => {
            console.log(`Check is game finished: ${player}`)
            // Nếu vẫn còn thì giá trị bị gán false
            result = colorBoard.isNoMoreMove(player)
            console.log(`Is game finished: ${result}`)
        })
        return result
    }

    watch(isGameFinished, (newValue, oldValue) => {
        // NewValue = true => gameFinished
        if(newValue) {
            console.log(playerList)
            if(colorBoard.isNoMoreMove(playerList[0])) {
                colorBoard.forEachBoardCell((i, j, cell) => {
                    if(cell.owner === "none") {
                        cell.owner = playerList[1]
                        cell.color = playerColor.value[1]
                    }
                })
            } else {
                colorBoard.forEachBoardCell((i, j, cell) => {
                    if(cell.owner === "none") {
                        cell.owner = playerList[0]
                        cell.color = playerColor.value[0]
                    }
                })
            }
            playerList.forEach((player, index) => {
                playerScore.value[index] = colorBoard.calculateScore(player)
            })
        } 
    })

    let getWinningPlayer = () => {
        if (isGameFinished.value) {
            let maxScoreIndex = playerScore.value.indexOf(Math.max(...playerScore.value))
            return playerList[maxScoreIndex]
        } else {
            return ""
        }
    }

    return {
        colorBoard,
        currentPlayerNum,
        playerList,
        playerScore,
        playerColor,
        isGameFinished,
        // Hàm
        nextPlayer,
        playerMove,
        getWinningPlayer
    }
}