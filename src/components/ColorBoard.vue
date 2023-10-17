<template>
    <div class="parent">
        <va-button v-for="i in numberOfCells" size="small" :rounded="false" :color="cellColors[i - 1]" />
    </div>
</template>

<script setup lang="ts">
import { VaButton } from "vuestic-ui"
import { computed } from 'vue';
import { CellState, colorMap } from 'src/core/colorBoardManager';
import { useGameStore } from "src/plugin/pinia";

let props = defineProps<{
    colorBoard: CellState[][]
}>()

let gameStore = useGameStore()

let numberOfCells = computed(() => {
    return gameStore.boardSize ** 2
})

let cellColors = computed(() => {
    return props.colorBoard.map((array: Array<CellState>) => {
        return array.map((element: CellState) => {
            return colorMap[element.color]
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