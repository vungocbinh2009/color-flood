import { Ref, onBeforeMount, onMounted, ref } from "vue"


export class PLayerStat {
    name: string = ""
    color: number = 0
    score: number = 0
    numCell: number = 0
    numBonusCell: number = 0
}

// File này chứa các thông tin liên quan đến ván đấu.
export let useGameStat = (playerList: Array<string>) => {
    let playerStatList: Ref<Array<PLayerStat>> = ref([])

    let initGameStat = () => {
        playerStatList.value = playerList.map((name: string) => {
            let player = new PLayerStat()
            player.name = name
            return player
        })
    }

    onBeforeMount(() => {
        initGameStat()
    })

    let updatePlayerStat = (playerName: string, newStat: Partial<PLayerStat>) => {
        let index = playerStatList.value.findIndex((playerStat: PLayerStat) => {
            return playerStat.name === playerName
        })
        playerStatList.value[index] = {...playerStatList.value[index], ...newStat}
    }

    return {
        playerStatList,
        initGameStat,
        updatePlayerStat
    }
}