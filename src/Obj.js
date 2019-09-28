/* jshint esversion: 9 */
import Polygon from 'polygon';

export default class Obj {
  constructor(scene, index, polygon) {
    this.scene = scene;
    this.index = index;
    this.polygon = polygon;
    this.bbox = polygon.aabb();
    this.sprite = scene.matter.add.sprite(0, 0, "obj_"+index, 0);

    


    const { Body, Bodies, Vertices } = Phaser.Physics.Matter.Matter;
    let c = Vertices.centre(polygon.points);

    const objBody = Bodies.fromVertices(c.x,c.y,polygon.points);


    this.sprite
      .setExistingBody(objBody)
      .setFixedRotation() // Sets inertia to infinity so the player can't rotate
      .setStatic(true)

    //this.sprite.y = this.polygon.center().y
  }
}