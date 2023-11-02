import { computed, onMounted, ref, watch } from "vue";
import { ColorBoardManagerParams, useColorBoardManager } from "./colorBoardManager";
import { getStartPosition } from "./startPosition";

export let useGameManager = (params: ColorBoardManagerParams) => {
    let {boardSize, numColor, playerList, randomObstacle} = params
    let colorBoard = useColorBoardManager(params)
    let currentPlayerNum: number = 0
    let playerScore = ref([0, 0])
    let numPlayerCell = ref([0, 0])
    let numPlayerBonusCell = ref([0, 0])

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
        numPlayerCell.value = new Array<number>(playerList.length)
        numPlayerBonusCell.value = new Array<number>(playerList.length)
        for(let i=0; i < playerList.length; i++) {
            playerScore.value[i] = 0
            numPlayerCell.value[i] = 0
            numPlayerBonusCell.value[i] = 0
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
            // Flood fill tính điểm cho người chơi trong lượt đầu
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
        // Tính các thông số.
        playerScore.value[currentPlayerNum] = colorBoard.calculateScore(player)
        numPlayerCell.value[currentPlayerNum] = colorBoard.calculateNumCell(player)
        numPlayerBonusCell.value[currentPlayerNum] = colorBoard.calculateNumBonusCell(player)
        nextPlayer()
        console.log(`Current player: ${currentPlayerNum}`)
        isGameFinished.value = isGameFinishedFunc()
    }

    let isGameFinishedFunc = () => {
        let moveablePlayer = 0
        playerList.forEach((player) => {
            console.log(`Check is game finished: ${player}`)
            // Nếu vẫn còn thì giá trị bị gán false
            if(!colorBoard.isNoMoreMove(player)) {
                moveablePlayer++
            }
        })
        return moveablePlayer === 1
    }

    watch(isGameFinished, (newValue, oldValue) => {
        // NewValue = true => gameFinished
        if(newValue) {
            playerList.forEach((player: string, index: number) => {
                if(!colorBoard.isNoMoreMove(player)) {
                    colorBoard.forEachBoardCell((i, j, cell) => {
                        if(cell.owner === "none") {
                            cell.owner = player
                            cell.color = playerColor.value[index]
                        }
                    })
                }
                playerScore.value[index] = colorBoard.calculateScore(player)
                numPlayerCell.value[index] = colorBoard.calculateNumCell(player)
                numPlayerBonusCell.value[index] = colorBoard.calculateNumBonusCell(player)
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
        numPlayerCell,
        numPlayerBonusCell,
        playerColor,
        isGameFinished,
        // Hàm
        nextPlayer,
        playerMove,
        getWinningPlayer
    }
}