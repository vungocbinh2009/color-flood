import { faTruckMedical } from "@fortawesome/free-solid-svg-icons";

// Hàm này kiểm tra xem tọa độ x, y có vượt ra ngoài bảng gameBoard không?
function isOutOfBounds(m: number, n: number, x: number, y: number) {
    if (x < 0 || x >= m || y < 0 || y >= n) {
        return true
    }
    return false
}

function isValidfloodFillCell(gameBoard: number[][], m: number, n: number,
    x: number, y: number, prevNumber: number, newNumber: number) {
    if (isOutOfBounds(m, n, x, y) || gameBoard[x][y] != prevNumber || gameBoard[x][y] == newNumber) {
        return false
    }
    return true
}

// FloodFill function
// Hàm sẽ trả về bảng gameBoard sau khi đổi màu.
export function floodFill(gameBoard: number[][], m: number, n: number,
     x: number, y: number, prevNumber: number, newNumber: number): number[][]
{
    let queue: number[][] = [];

    // Append the position of starting
    // pixel of the component
    queue.push([x, y]);
 
    // Color the pixel with the new color
    gameBoard[x][y] = newNumber;
 
    // While the queue is not empty i.e. the
    // whole component having prevC color
    // is not colored with newC color
    while(queue.length > 0)
    {
        // Dequeue the front node
        let currPixel = queue[queue.length - 1];
        queue.pop();
 
        let posX = currPixel[0];
        let posY = currPixel[1];
 
        // Check if the adjacent
        // pixels are valid
        if (isValidfloodFillCell(gameBoard, m, n, posX+1, posY, prevNumber, newNumber))
        {
            gameBoard[posX + 1][posY] = newNumber;
            queue.push([posX + 1, posY]);
        }
 
        if (isValidfloodFillCell(gameBoard, m, n, posX - 1, posY, prevNumber, newNumber))
        {
            gameBoard[posX-1][posY] = newNumber;
            queue.push([posX-1, posY]);
        }
 
        if (isValidfloodFillCell(gameBoard, m, n, posX, posY+1, prevNumber, newNumber))
        {
            gameBoard[posX][posY + 1]= newNumber;
            queue.push([posX, posY + 1]);
        }
 
        if (isValidfloodFillCell(gameBoard, m, n, posX, posY-1, prevNumber, newNumber))
        {
            gameBoard[posX][posY-1]= newNumber;
            queue.push([posX, posY-1]);
        }
    }

    return gameBoard
}



// Hàm này dùng dể tính điểm cho 1 trong 2 đội (dùng giá trị x, y)
export function calculateScore(screen: number[][], m: number, n: number,
     x: number, y: number, color: number): number {
    let queue: number[][] = []
    let score = 0
    let visited: boolean[][] = []

    for(let i: number = 0; i < m; i++) {
        visited[i] = []
        for(let j: number = 0; j < n; j++) {
            visited[i][j] = false
        }
    }

    queue.push([x, y]);
    if(screen[x][y] == color) {
        score++
        visited[x][y] = true
    } else {
        return 0
    }
 
    while(queue.length > 0)
    {
        let currPixel = queue[queue.length - 1];
        queue.pop();
 
        let posX = currPixel[0];
        let posY = currPixel[1];
 
        if(!isOutOfBounds(m, n, posX+1, posY) &&
         screen[posX+1][posY] === color && !visited[posX+1][posY]) {
            queue.push([posX + 1, posY]);
            visited[posX+1][posY] = true
            score++
        }

        if(!isOutOfBounds(m, n, posX-1, posY) &&
         screen[posX-1][posY] === color && !visited[posX-1][posY]) {
            queue.push([posX - 1, posY]);
            visited[posX-1][posY] = true
            score++
        }

        if(!isOutOfBounds(m ,n, posX, posY+1) &&
         screen[posX][posY+1] === color && !visited[posX][posY+1]) {
            queue.push([posX, posY+1]);
            visited[posX][posY+1] = true
            score++
        }

        if(!isOutOfBounds(m ,n, posX, posY-1) &&
         screen[posX][posY-1] === color && !visited[posX][posY-1]) {
            queue.push([posX, posY-1]);
            visited[posX][posY-1] = true
            score++
        }
    }
    return score
}