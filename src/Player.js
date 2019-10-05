/* jshint esversion: 9 */

import MultiKey from "./multikey.js";
const { Body, World, Bodies } = Phaser.Physics.Matter.Matter; 
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.matter.add.sprite(0, 0, "player", 0);

    this.hook = null;

    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h);
    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 24, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.45, 0, 2, h * 0.5, { isSensor: true }),
      right: Bodies.rectangle(w * 0.45, 0, 2, h * 0.5, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionStatic: 0,
      frictionAir: 0.01,
      friction: 1,
      restitution: 0
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation() // Sets inertia to infinity so the player can't rotate
      .setPosition(x, y)
      .setBounce(0);

    // Track which sensors are touching something
    this.isTouching = { left: false, right: false, ground: false };

    // Jumping is going to have a cooldown
    this.canJump = true;
    this.jumpCooldownTimer = null;

    // Before matter's update, reset our record of which surfaces the player is touching.
    scene.matter.world.on("beforeupdate", this.resetTouching, this);

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });

    // Track the keys
    const { LEFT, RIGHT, UP, A, D, W, SPACE } = Phaser.Input.Keyboard.KeyCodes;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.leftInput = new MultiKey(scene, [LEFT, A]);
    this.rightInput = new MultiKey(scene, [RIGHT, D]);
    this.jumpInput = new MultiKey(scene, [UP, W]);
    this.attackInput = new MultiKey(scene, [SPACE]);


    this.scene.input.on('pointerdown',  (pointer) => {
      this.createHook(pointer.x, pointer.y);
    }, this.scene);

    this.scene.input.on('pointerup', (pointer) => {
      this.breakHook();
    });

    this.destroyed = false;
    this.scene.events.on("update", this.update, this);
    this.scene.events.once("shutdown", this.destroy, this);
    this.scene.events.once("destroy", this.destroy, this);

  }

  createHook (x, y) {
    let rx = x + this.scene.cameras.main.scrollX;
    let ry = y + this.scene.cameras.main.scrollY;

    this.breakHook();

    this.hook = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x: rx, y: ry },
      bodyB: this.sprite.body
    });
    this.scene.matter.world.add(this.hook);
  }
  breakHook () {
    if (this.hook) {
      this.scene.matter.world.remove(this.hook);
      this.hook = false;
    }
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return; // We only care about collisions with physical objects
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
    } else if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
    if (this.destroyed) return;
    const sprite = this.sprite;
    const velocity = sprite.body.velocity;
    const isRightKeyDown = this.rightInput.isDown();
    const isLeftKeyDown = this.leftInput.isDown();
    const isJumpKeyDown = this.jumpInput.isDown();
    const isAttackKeyDown = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    const isOnGround = this.isTouching.ground;
    const isInAir = !isOnGround;

    if (isLeftKeyDown) {
      sprite.setFlipX(true);
      if (!(isInAir && this.isTouching.left)) {
        sprite.setVelocityX(-4);
      }
    } else if (isRightKeyDown) {
      sprite.setFlipX(false);
      if (!(isInAir && this.isTouching.right)) {
        sprite.setVelocityX(4);
      }
    }

    if (isJumpKeyDown && this.canJump && isOnGround || isJumpKeyDown && this.canJump && this.hook) {
      sprite.setVelocityY(-8);

      this.canJump = false;
      this.jumpCooldownTimer = this.scene.time.addEvent({
        delay: 250,
        callback: () => (this.canJump = true)
      });
    }

    // Hook

    if (this.hook) {
     // Shorten distance
     if (this.hook.length > 30) {
      this.hook.length -= 6;
     } else {
       this.breakHook();
     }
    }

  }

  destroy() {
    // Clean up any listeners that might trigger events after the player is officially destroyed
    this.scene.events.off("update", this.update, this);
    this.scene.events.off("shutdown", this.destroy, this);
    this.scene.events.off("destroy", this.destroy, this);
    if (this.scene.matter.world) {
      this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
    }
    const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
    this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
    this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });
    if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();

    this.destroyed = true;
    this.sprite.destroy();
  }
}