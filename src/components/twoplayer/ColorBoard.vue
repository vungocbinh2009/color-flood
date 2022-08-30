<template>
    <div class="parent">
        <va-button v-for="i in numberOfCells" size="small" :rounded="false" :color="cellColors[i - 1]"/>
    </div>
</template>

<script setup lang="ts">
import { VaButton } from "vuestic-ui"
import { computed } from 'vue';
import { colorMap } from 'src/plugin/constant';

let props = defineProps<{
    boardSize: number,
    boardCurrentState: number[][]
}>()

    let numberOfCells = computed(() => {
        return props.boardSize * props.boardSize
    })

let cellColors = computed(() => {
    return props.boardCurrentState.map((array: Array<number>) => {
        return array.map((element: number) => {
            return colorMap[element]
        })
    }).flat()
})

</script>

<style scoped>
.parent {
    display: grid;
    grid-template-columns: repeat(v-bind('props.boardSize'), 1fr);
    grid-template-rows: repeat(v-bind('props.boardSize'), 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    aspect-ratio: 1/1;
}
</style>