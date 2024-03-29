import random from "random"
import { Ref, onBeforeMount, onMounted, ref } from "vue"

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
    // Màu sắc của ô, được đánh dấu bằng số.
    color: number = 0
    // người chơi có thể nhìn thấy ô này hay không?
    visible: boolean = true
    // ĐIểm số khi chiếm được ô này.
    score: number = 1
    // Chủ sở hữu của ô này.
    owner: string = "none"
    // Ô này có phải là ô xuất phát của player hay không?
    init: boolean = false
}

export interface ColorBoardManagerParams {
    boardSize: number
    numColor: number
    playerList: string[]
    randomObstacle: boolean,
    bonusScore: boolean
}

export let useColorBoardManager = (params: ColorBoardManagerParams) => {
    // follow thuộc tính này để cập nhật map.
    let {boardSize, numColor, playerList, randomObstacle, bonusScore} = params
    let gameBoard: Ref<CellState[][]> = ref(new Array<CellState[]>(boardSize))

    onBeforeMount(() => {
        initBoard(boardSize, numColor, playerList)
    })

    // Function
    let initBoard = (boardSize: number, numColor: number, playerList: string[]) => {
        boardSize = boardSize
        numColor = numColor
        playerList = playerList
        let bernoulliRandom = random.bernoulli(0.05)
        // Random màu và trạng thái active cho gameboard
        for (let i=0; i<boardSize; i++) {
            gameBoard.value[i] = new Array<CellState>(boardSize)
            for (let j=0; j<boardSize; j++) {
                gameBoard.value[i][j] = new CellState()
                gameBoard.value[i][j].color = random.int(0, numColor - 1)
                if(randomObstacle) {
                    // Hầu hết giá trị nhỏ hơn 0.05
                    let randomValueBool = bernoulliRandom() > 0.05
                    if(randomValueBool) {
                        gameBoard.value[i][j].active = false
                        gameBoard.value[i][j].score = 0
                    }
                }
                if(bonusScore) {
                    // Hầu hết giá trị nhỏ hơn 0.05
                    let randomValueBool = bernoulliRandom() > 0.05
                    if(randomValueBool) {
                        gameBoard.value[i][j].score = 5
                    }
                }
            }
        }
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
        // Lọc bỏ các ô là chướng ngại vật, chỉ lấy ô active.
        adjList = adjList.filter((value) => {
            return value.active === true
        })
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
        
        // Nếu tempowner > 0 thì chạy tiếp.
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

    // Đếm số ô người chơi đang có
    let calculateNumCell = (player: string) => {
        let count = 0
        forEachBoardCell((i, j, value) => {
            if(value.owner === player) {
                count++
            }
        })
        return count
    }

    // Đếm số ô điểm thưởng người chơi có.
    let calculateNumBonusCell = (player: string) => {
        let count = 0
        forEachBoardCell((i, j, value) => {
            if(value.owner === player && value.score === 5) {
                count++
            }
        })
        return count
    }

    let isNoMoreMove = (player: string) => {
        let result = true
        forEachBoardCell((i, j, value) => {
            if(value.owner === player) {
                let adjCell = getAdjacencyCell(i, j)
                adjCell.forEach((cell) => {
                    if(cell.owner === "none") {
                        result = false
                    }
                })
            }
        })
        // Nếu xung quanh không còn ô nào trống thì trả về true
        return result
    }

    // Hàm này tính điểm một lựa chọn màu của máy. Máy sẽ chọn kết quả có điểm tốt nhất
    // Lưu ý: Hàm tính toán dựa trên nhiều tiêu chí, 
    // không thuần túy là xem lựa chọn nào nhiều điểm nhất
    let getBotChoiceScore = (player: string, newColor: number) => {
        // Dánh dấu các ô mới khi đổi màu
        maskNewCell(player, newColor)
        let startCellPosition = [0, 0]
        forEachBoardCell((i, j, cell) => {
            if(cell.owner === player && cell.init) {
                startCellPosition = [i, j]
            }
        })
        // Đếm các ô mới được đánh dấu.
        let score = 0
        // Xóa bỏ các ô đánh dấu tạm.
        forEachBoardCell((i, j, cell) => {
            if(cell.owner === `${player}-temp`) {
                let adjCell = getAdjacencyCell(i, j)
                let ownedAdjCell = adjCell.filter((cell) => {
                    return cell.owner === player || cell.owner === `${player}-temp`
                })
                if(ownedAdjCell.length <= 2) {
                    score += Math.sqrt(
                        (i - startCellPosition[0])**2 +
                        (j - startCellPosition[1])**2
                    )
                } else {
                    // Thêm đoạn này để bot có thể end game.
                    score += 0.1
                }
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
                    scoreDiffPerColor.push(getBotChoiceScore(playerList[1], i))
                } else {
                    // Nếu trùng 2 màu trên thì trả kết quả là 0 điểm.
                    scoreDiffPerColor.push(0)
                }
        }
        console.log(scoreDiffPerColor)
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
        calculateNumCell,
        calculateNumBonusCell,
        isNoMoreMove,
        bestPickNumber,
    }
}