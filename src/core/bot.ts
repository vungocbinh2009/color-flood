import { calculateScore, floodFill } from "./floodFill"

// File này chứa các đoạn code để tạo 1 con bot chơi game
// Hàm này dùng để chọn 1 màu để chơi.
export let botPickNumber = (gameBoard: number[][], numberOfColors: number, bannedNumber: number): number => {
    let pickableNumber: number[] = []
    for(let i = 0; i < numberOfColors; i++) {
        if(i != gameBoard[0][0] 
            && i != gameBoard[gameBoard.length - 1][gameBoard[0].length - 1]
            && i != bannedNumber) {
                pickableNumber.push(i)
            }
    }
    
    let nextScores = pickableNumber.map((value) => {
        let screenCopy = gameBoard.map((arr: number[]) => {
            return arr.slice()
        })
        floodFill(screenCopy,
            screenCopy.length, screenCopy[0].length,
            screenCopy.length - 1, screenCopy[0].length - 1,
            screenCopy[screenCopy.length - 1][screenCopy[0].length - 1],
            value
        )
        let nextScore = calculateScore(screenCopy,
            screenCopy.length, screenCopy[0].length,
            screenCopy.length - 1, screenCopy[0].length - 1,
            value
        )
        return nextScore
    })
    let colorIndex = nextScores.indexOf(Math.max(...nextScores))
    return pickableNumber[colorIndex]
}

// Hàm này dùng để chọn 1 màu để ban. Lưu ý là chỉ chọn màu ban sau khi đã chọn màu pick.
export let botBanNumber = (screen: number[][], numberOfColors: number, bannedNumber: number): number => {
    let pickableNumber: number[] = []
    for(let i = 0; i < numberOfColors; i++) {
        if(i != screen[0][0] 
            && i != screen[screen.length - 1][screen[0].length - 1]
            && i != bannedNumber) {
                pickableNumber.push(i)
            }
    }
    
    let nextScores = pickableNumber.map((value) => {
        let screenCopy = screen.map((arr: number[]) => {
            return arr.slice()
        })
        floodFill(screenCopy,
            screenCopy.length, screenCopy[0].length,
            0, 0,
            screenCopy[0][0],
            value
        )
        let nextScore = calculateScore(screenCopy,
            screenCopy.length, screenCopy[0].length,
            0, 0,
            value
        )
        return nextScore
    })
    let colorIndex = nextScores.indexOf(Math.max(...nextScores))
    return pickableNumber[colorIndex]
}