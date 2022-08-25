<template>
    <div class="parent">
        <va-button v-for="i in numberOfCells" size="small" :rounded="false" :color="cellColors[i - 1]">
            {{spaceChar}}
        </va-button>
    </div>
</template>

<script setup lang="ts">
import { VaButton } from "vuestic-ui"
import { computed } from 'vue';
import { colorMap } from '../plugin/constant';
import { useGameStore } from '../plugin/pinia';

let gameStore = useGameStore()

let numberOfCells = computed(() => {
    return gameStore.boardSize * gameStore.boardSize
})

let spaceChar = "  "

let cellColors = computed(() => {
    return gameStore.boardCurrentState.map((array: Array<number>) => {
        return array.map((element: number) => {
            return colorMap[element]
        })
    }).flat()
})

</script>

<style scoped>
.parent {
    display: grid;
    grid-template-columns: repeat(v-bind('gameStore.boardSize'), 1fr);
    grid-template-rows: repeat(v-bind('gameStore.boardSize'), 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    aspect-ratio: 1/1;
} 
</style>