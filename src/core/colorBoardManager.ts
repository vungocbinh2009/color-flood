import random from "random"
import { Ref, onMounted, ref } from "vue"

// Các màu được dùng trong game.
export let colorMap = [
    "#c51162",
    "#6200ea",
    "#2962ff",
    "#00bfa5",
    "#64dd17",
    "#ffd600",
    "#dd2c00",
    "#424242"
]

// Trạng thái của các ô
export class CellState {
    // Ô này có active hay không, nếu không thì coi như chướng ngại vật
    active: boolean = true
    color: number = 0
    visible: boolean = true
    score: number = 1
    owner: string = "none"
}

export let useColorBoardManager = (boardSize: number, numColor: number, playerList: string[]) => {
    // follow thuộc tính này để cập nhật map.
    let gameBoard: Ref<CellState[][]> = ref(new Array<CellState[]>(boardSize))

    onMounted(() => {
        initBoard(boardSize, numColor, playerList)
    })

    // Function
    let initBoard = (boardSize: number, numColor: number, playerList: string[]) => {
        boardSize = boardSize
        numColor = numColor
        playerList = playerList
        // Random màu cho gameboard
        for (let i=0; i<boardSize; i++) {
            gameBoard.value[i] = new Array<CellState>(boardSize)
            for (let j=0; j<boardSize; j++) {
                gameBoard.value[i][j] = new CellState()
                gameBoard.value[i][j].color = random.int(0, numColor - 1)
            }
        }
        // Đặt owner của hai màu ở góc bảng
        gameBoard.value[0][0].owner = playerList[0]
        gameBoard.value[boardSize-1][boardSize-1].owner = playerList[1]
    }

    let forEachBoardCell = (func: (i: number, j:number, cell: CellState) => void) => {
        gameBoard.value.forEach((array, index1) => {
            array.forEach((value, index2) => {
                func(index1, index2, value)
            })
        })
    }

    let getAdjacencyCell = (i: number, j: number) => {
        let adjList: CellState[] = []
        if (i > 0) {
            adjList.push(gameBoard.value[i-1][j])
        }
        if (i < boardSize-1) {
            adjList.push(gameBoard.value[i+1][j])
        }
        if (j > 0) {
            adjList.push(gameBoard.value[i][j-1])
        }
        if (j < boardSize-1) {
            adjList.push(gameBoard.value[i][j+1])
        }
        return adjList
    }

    // Hàm này đánh dấu các ô mới có được sau khi thay đổi màu
    let maskNewCell = (player: string, newColor: number) => {
        let tempOwner = 0
        forEachBoardCell((i, j, value) => {
            // Dùng player `${player}-temp` để đánh dấu tạm thời.
            if(value.owner === player || value.owner === `${player}-temp`) {
                let adjCell = getAdjacencyCell(i, j)
                adjCell.forEach((cell) => {
                    if(cell.color === newColor && (cell.owner === "none")) {
                        tempOwner++
                        cell.owner = `${player}-temp`
                    }
                })
            }
        })
        
        // Nếu tempowner > 0 thì chạy tiếp, nếu không thì đếm số ô temp và trả kết quả.
        if (tempOwner > 0) {
            maskNewCell(player, newColor)
        }
    }

    let floodFill = (player: string, newColor: number) => {
        // Thay toàn bộ màu ô của người chơi thành màu mới.
        forEachBoardCell((i, j, value) => {
            if(value.owner === player) {
                value.color = newColor
            }
        })
        // Đánh dấu các ô mới (đệ quy)
        maskNewCell(player, newColor)
        // Chuyển các ô mới thành ô của người chơi.
        forEachBoardCell((i, j, value) => {
            if(value.owner === `${player}-temp`) {
                value.owner = player
            }
        })
    }

    let calculateScore = (player: string) => {
        let score = 0
        forEachBoardCell((i, j, value) => {
            if(value.owner === player) {
                score += value.score
            }
        })
        return score
    }

    let isNoMoreMove = (player: string) => {
        let result = true
        forEachBoardCell((i, j, value) => {
            if(value.owner === player) {
                let adjCell = getAdjacencyCell(i, j)
                adjCell.forEach((cell) => {
                    //console.log(cell.owner === "none")
                    if(cell.owner === "none") {
                        result = false
                    }
                })
            }
        })
        // Nếu xung quanh không còn ô nào trống thì trả về true
        return result
    }

    let scoreDiff = (player: string, newColor: number) => {
        // Dánh dấu các ô mới khi đổi màu
        maskNewCell(player, newColor)
        // Đếm các ô mới được đánh dấu.
        let score = calculateScore(`${player}-temp`)
        // Xóa bỏ các ô đánh dấu tạm.
        forEachBoardCell((i, j, cell) => {
            if(cell.owner === `${player}-temp`) {
                cell.owner = "none"
            }
        })
        return score
    }

    let bestPickNumber = () => {
        let scoreDiffPerColor: number[] = []
        for(let i = 0; i < numColor; i++) {
            if(i != gameBoard.value[0][0].color 
                && i != gameBoard.value[boardSize - 1][boardSize - 1].color) {
                    scoreDiffPerColor.push(scoreDiff("player2", i))
                } else {
                    // Nếu trùng 2 màu trên thì trả kết quả là 0 điểm.
                    scoreDiffPerColor.push(0)
                }
        }
        
        return scoreDiffPerColor.indexOf(Math.max(...scoreDiffPerColor))
    }

    return {
        playerList,
        boardSize,
        numColor,
        gameBoard,
        // Hàm
        floodFill,
        forEachBoardCell,
        calculateScore,
        isNoMoreMove,
        bestPickNumber,
    }
}