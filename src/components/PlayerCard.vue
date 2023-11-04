<template>
    <va-card square :class="[layoutLeft ? 'container-left' : 'container-right']" 
        :color="colorMap[props.playerStat.color]">
        <h1 class="score text-score player-score">{{props.playerStat.score}}</h1>
        <va-chip class="cell" :color="colorMap[props.playerStat.color]">
            Cell: {{ props.playerStat.numCell }}
        </va-chip>
        <va-chip class="bonus-cell" :color="colorMap[props.playerStat.color]">
            Bonus: {{ props.playerStat.numBonusCell }}
        </va-chip>
    </va-card>
</template>

<script setup lang="ts">
import { VaCard, VaChip } from 'vuestic-ui';
import { PLayerStat } from 'src/core/gameStat';
import { colorMap } from "src/core/colorBoardManager"

let props = defineProps<{
    playerStat: PLayerStat
    layoutLeft: boolean
}>()
</script>

<style scoped>
.container-left {
  display: grid; 
  grid-template-columns: 1fr 4fr; 
  grid-template-rows: 1fr 1fr; 
  gap: 0px 0px; 
  grid-template-areas: 
    "cell score"
    "bonus-cell score"; 
}

.container-right {
  display: grid; 
  grid-template-columns: 4fr 1fr; 
  grid-template-rows: 1fr 1fr; 
  gap: 0px 0px; 
  grid-template-areas: 
    "score cell"
    "score bonus-cell"; 
}
.cell { 
    grid-area: cell;
    font-weight: 900;
    font-size: 23;
}
.bonus-cell { 
    grid-area: bonus-cell;
    font-weight: 900;
    font-size: 23;
}
.score { grid-area: score; }
.player-score {
    text-align: center;
    justify-content: center;
}

.text-score {
    font-size: 60px;
}
</style>