<template>
  <div class="container">
    <canvas ref="canvas" width="800" height="600"></canvas>
  </div>
</template>

<script>
import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import MainScene from "../sceneA.js";
export default {
  name: 'Engine',
  data () {
    return {
      
    }
  },
  mounted () {
    this.$nextTick(() => {
    let config = {
        type: Phaser.WEBGL,
        canvas: this.$refs.canvas,
        antialias: true,
        width: 800,
        height: 600,
        backgroundColor: '#222222',
        physics: {
            default: 'matter',
            matter: {
            }
        },
        plugins: {
          scene: [
            {
              plugin: PhaserMatterCollisionPlugin,
              key: "matterCollision",
              mapping: "matterCollision"
            }
          ]
        },
        scene: MainScene,
    };

    const game = new Phaser.Game(config);
    })
  }
}
</script>
