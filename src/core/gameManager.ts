import { computed, onMounted, ref, watch } from "vue";
import { ColorBoardManagerParams, useColorBoardManager } from "./colorBoardManager";
import { getStartPosition } from "./startPosition";
import { PLayerStat, useGameStat } from "./gameStat";

export let useGameManager = (params: ColorBoardManagerParams) => {
    let {boardSize, numColor, playerList, randomObstacle} = params
    let colorBoard = useColorBoardManager(params)
    let gameStat = useGameStat(playerList)
    let currentPlayerNum: number = 0
    let isGameFinished = ref(false)
    let startPos = getStartPosition(boardSize, "corner", playerList)

    onMounted(() => {
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
            let player = playerList[index]
            gameStat.updatePlayerStat(player, {
                score: colorBoard.calculateScore(player),
                color: colorBoard.gameBoard.value[pos[0]][pos[1]].color,
                numCell: colorBoard.calculateNumCell(player),
                numBonusCell: colorBoard.calculateNumBonusCell(player)
            })
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
        let playerStartPos = startPos[currentPlayerNum]
        // Tính các thông số.
        gameStat.updatePlayerStat(player, {
            score: colorBoard.calculateScore(player),
            color: colorBoard.gameBoard.value[playerStartPos[0]][playerStartPos[1]].color,
            numCell: colorBoard.calculateNumCell(player),
            numBonusCell: colorBoard.calculateNumBonusCell(player)
        })
        nextPlayer()
        isGameFinished.value = isGameFinishedFunc()
    }

    // Hàm kiểm tra xem trò chơi đã kết thúc chưa.
    // Lưu ý: Hàm chỉ đúng khi có ít nhất 2 người chơi.
    let isGameFinishedFunc = () => {
        let moveablePlayer = 0
        playerList.forEach((player) => {
            console.log(`Check is game finished: ${player}`)
            // Nếu vẫn còn thì giá trị bị gán false
            if(!colorBoard.isNoMoreMove(player)) {
                moveablePlayer++
            }
        })
        if(playerList.length === 1) {
            // Trò chơi kết thúc khi người chơi duy nhất không di chuyển được
            return moveablePlayer === 0
        } else {
            // Trò chơi kết thúc khi chỉ có 1 người di chuyển được.
            return moveablePlayer === 1
        }
    }

    watch(isGameFinished, (newValue, oldValue) => {
        // NewValue = true => gameFinished
        if(newValue) {
            playerList.forEach((player: string, index: number) => {
                let playerStartPos = startPos[index]
                let color = colorBoard.gameBoard.value[playerStartPos[0]][playerStartPos[1]].color
                if(!colorBoard.isNoMoreMove(player)) {
                    colorBoard.forEachBoardCell((i, j, cell) => {
                        if(cell.owner === "none" && cell.active) {
                            cell.owner = player
                            cell.color = color
                        }
                    })
                }
                gameStat.updatePlayerStat(player, {
                    score: colorBoard.calculateScore(player),
                    color: color,
                    numCell: colorBoard.calculateNumCell(player),
                    numBonusCell: colorBoard.calculateNumBonusCell(player)
                })
            })
        } 
    })

    let getWinningPlayer = () => {
        if (isGameFinished.value) {
            let allPlayerScore = gameStat.playerStatList.value.map((player: PLayerStat) => {
                return player.score
            })
            let maxScoreIndex = allPlayerScore.indexOf(Math.max(...allPlayerScore))
            return playerList[maxScoreIndex]
        } else {
            return ""
        }
    }

    return {
        colorBoard,
        currentPlayerNum,
        playerList,
        gameStat,
        isGameFinished,
        // Hàm
        nextPlayer,
        playerMove,
        getWinningPlayer
    }
}