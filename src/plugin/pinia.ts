import { defineStore } from "pinia";

export let useModeStore = defineStore("modeStore", () => {
    let boardSize = 15
    let numberOfColor = 6
    return {boardSize, numberOfColor}
})