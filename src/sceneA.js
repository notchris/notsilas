/* jshint esversion: 6 */
import Phaser from 'phaser';
import Player from "./Player.js";
import Obj from './Obj.js';
import Img from './Img.js';
const { Body, Bodies } = Phaser.Physics.Matter.Matter;

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainScene' });
    }

    init (data) {
      this.polys = data.polygons;
      this.images = data.images;
      this.cursors = null;
      this.player = null;
      this.jumpSensor = null;
      this.map = {
        width: 2000,
        height: 800
      }
    }

    create() {
      this.cursors = this.input.keyboard.createCursorKeys();



      // Camera & World Bounds
      this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
      this.matter.world.setBounds(0, 0, this.map.width, this.map.height);


      // Player
      this.player = new Player(this, 100, 100);
      this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

      this.polys.forEach((poly, index) => {
        new Obj(this,index,poly)
      });

      this.images.forEach((img) => {
        new Img(this,img)
      });

      this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
        objectA: this.player.sprite,
        callback: this.onPlayerCollide,
        context: this
      });

    }

    onPlayerCollide({ gameObjectB }) {
      if (!gameObjectB) return;
  
      //const tile = gameObjectB;
  
      // Check the tile property set in Tiled (you could also just check the index if you aren't using
      // Tiled in your game)
      /*if (tile.properties.isLethal) {
        // Unsubscribe from collision events so that this logic is run only once
        this.unsubscribePlayerCollide();
  
        this.player.freeze();
        const cam = this.cameras.main;
        cam.fade(250, 0, 0, 0);
        cam.once("camerafadeoutcomplete", () => this.scene.restart());
      }*/
    }

    onPlayerCollideEnd({ gameObjectB }) {

    }

    update() {

    }
}