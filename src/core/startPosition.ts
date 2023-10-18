import { useColorBoardManager } from "./colorBoardManager"
// File này trong tương lai sẽ dùng để viết hàm chọn vị trí
// Các ô làm vị trí xuất phát của player.

type StartPosition = "corner" | "edge"

export let getStartPosition = (
    boardSize: number, startPosition: StartPosition,
    playerList: string[]): number[][] => {
        let midPoint = (boardSize - 1) / 2
        let startPosFunc: Record<StartPosition, () => number[][]> = {
            "corner": () => {
                if(playerList.length === 1) {
                    return [
                        [0, 0] // player1
                    ]
                } else {
                    return [
                        [0, 0], //player1
                        [boardSize-1, boardSize-1] //player2
                    ]
                }
            },
            "edge": () => {
                if(playerList.length === 1) {
                    return [
                        [midPoint, 0]
                    ]
                } else {
                    return [
                        [midPoint, 0],
                        [midPoint, boardSize-1]
                    ]
                }
            }
        }
        return startPosFunc[startPosition]()
}