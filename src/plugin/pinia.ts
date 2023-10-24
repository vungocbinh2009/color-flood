import { defineStore } from "pinia";
import { useGameManager } from "src/core/gameManager";
import { computed, ref } from "vue";

export let useGameStore = defineStore("gameStore", () => {
    let boardSize = ref(15)
    let numColor = ref(6)
    let playWithComputer = ref(true)
    // Chướng ngại vật ngẫu nhiên
    let randomObstacle = ref(true)
    // Điểm thưởng ngẫu nhiên
    let bonusScore = ref(true)
    let numPlayer = ref(2)

    let playerList = computed(() => {
        let playerList = []
        for(let i=0; i<numPlayer.value; i++) {
            playerList.push(`player${i+1}`)
        }
        return playerList
    })

    return {
        boardSize,
        numColor,
        playWithComputer,
        randomObstacle,
        bonusScore,
        numPlayer,
        playerList,
    }
})