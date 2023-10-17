import { onMounted, ref, watch } from "vue";
import { useColorBoardManager } from "./colorBoardManager";

export let useGameManager = (boardSize: number, numColor: number, playerList: string[]) => {
    
    let colorBoard = useColorBoardManager(boardSize, numColor, playerList)
    let currentPlayerNum: number = 0
    let playerScore = ref([0, 0])
    let playerColor = ref([0, 0])
    let isGameFinished = ref(false)

    onMounted(() => {
        playerScore.value = new Array<number>(playerList.length)
        playerColor.value = new Array<number>(playerList.length)
        for(let i=0; i < playerList.length; i++) {
            playerScore.value[i] = 0
        }
        playerColor.value[0] = colorBoard.gameBoard.value[0][0].color
        playerColor.value[1] = colorBoard.gameBoard.value[boardSize-1][boardSize-1].color
    })

    let nextPlayer = () => {
        if (currentPlayerNum >= playerList.length - 1) {
            currentPlayerNum = 0
        } else {
            currentPlayerNum++
        }
    }

    let updatePlayerCurrentColor = () => {
        let boardSize = colorBoard.boardSize
        playerColor.value = [
            colorBoard.gameBoard.value[0][0].color,
            colorBoard.gameBoard.value[boardSize - 1][boardSize - 1].color
        ]
    }

    let playerMove = (newColor: number) => {
        let player = playerList[currentPlayerNum]
        colorBoard.floodFill(player, newColor)
        playerScore.value[currentPlayerNum] = colorBoard.calculateScore(player)
        updatePlayerCurrentColor()
        nextPlayer()
        console.log(`Current player: ${currentPlayerNum}`)
        isGameFinished.value = isGameFinishedFunc()
    }

    let isGameFinishedFunc = () => {
        let result = true
        playerList.forEach((value) => {
            // Nếu vẫn còn thì giá trị bị gán false
            result = colorBoard.isNoMoreMove(value)
        })
        return result
    }

    watch(isGameFinished, (newValue, oldValue) => {
        // NewValue = true => gameFinished
        if(newValue) {
            if(colorBoard.isNoMoreMove("player1")) {
                colorBoard.forEachBoardCell((i, j, cell) => {
                    if(cell.owner === "none") {
                        cell.owner = "player2"
                        cell.color = playerColor.value[1]
                    }
                })
            } else {
                colorBoard.forEachBoardCell((i, j, cell) => {
                    if(cell.owner === "none") {
                        cell.owner = "player1"
                        cell.color = playerColor.value[0]
                    }
                })
            }
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
        updatePlayerCurrentColor,
        playerMove,
        getWinningPlayer
    }
}