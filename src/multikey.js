/* jshint esversion: 9 */
export default class MultiKey {
    constructor(scene, keys) {
      if (!Array.isArray(keys)) keys = [keys];
      this.keys = keys.map(key => scene.input.keyboard.addKey(key));
    }
  
    // Are any of the keys down?
    isDown() {
      return this.keys.some(key => key.isDown);
    }
  
    // Are all of the keys up?
    isUp() {
      return this.keys.every(key => key.isUp);
    }
  }