import { defineStore } from "pinia";

export let useGameSettingStore = defineStore("gameSettingStore", () => {
    let boardSize = 15
    let numberOfColor = 6
    let playWithComputer = true
    return {boardSize, numberOfColor, playWithComputer}
})