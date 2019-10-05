<template>
  <div id="app">
    <div class="container">
      <canvas ref="canvas" width="612" height="384"></canvas>
    </div>
  </div>
</template>

<script>
import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import Loading from "./Loading.js";
import MainScene from "./sceneA.js";

export default {
  name: 'app',
  data () {
    return {

    }
  },
  mounted () {
    let config = {
        type: Phaser.WEBGL,
        canvas: this.$refs.canvas,
        antialias: true,
        pixelArt: true,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#222222',
        physics: {
            default: 'matter',
            matter: {
              debug: true,
              gravity: {
                scale: 0.0009
              },
              plugins: {
                attractors: true
              }
            }
        },
        plugins: {
          scene: [
            {
              plugin: PhaserMatterCollisionPlugin, // The plugin class
              key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
              mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
            }
          ]
        },
        scene: [Loading,MainScene],
        map: null
    };
    const game = new Phaser.Game(config);
  }
}
</script>
