<script setup lang="ts">
import { useRouter } from 'vue-router';
import { VaButton } from "vuestic-ui"

let router = useRouter()

let choosePlayMode = () => {
  router.push("/mode")
}
</script>

<template>
  <div class="container">
    <div class="game-name">
      <h1 class="display-1">Color flood</h1>
      <h5 class="display-5">A simple color game made by vungocbinh2009</h5>
    </div>
    <va-button size="large" class="play-button" @click="choosePlayMode">Play</va-button>
  </div>

</template>

<style scoped>
.container {
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr; 
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr; 
  gap: 0px 0px; 
  grid-template-areas: 
    ". . ."
    "game-name game-name game-name"
    "game-name game-name game-name"
    ". . ."
    ". play-button ."
    ". . ."; 
}
.game-name {
   grid-area: game-name;
   text-align: center;
}
.play-button { grid-area: play-button; }
</style>