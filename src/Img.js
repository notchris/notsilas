/* jshint esversion: 9 */

export default class Img {
  constructor(scene, img) {
    this.scene = scene;
    this.id = img.id;
    this.sprite = scene.matter.add.sprite(img.x + img.width/2, img.y + img.height/2, img.id, 0);

    this.sprite
      .setFixedRotation() // Sets inertia to infinity so the player can't rotate
      .setStatic(true)
      .setSensor(true)

    //this.sprite.y = this.polygon.center().y
  }
}