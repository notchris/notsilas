/* jshint esversion: 9 */
import Phaser from 'phaser';
import Polygon from 'polygon';


const PSD = window.PSD;
const file = require('!raw-loader!./map.svg');

export default class Loading extends Phaser.Scene {
  constructor() {
    super({key: "Loading"});
}

    preload() {

        const polys = [];
        const images = [];

        let str = file.default.split("<svg").pop();
        let el = document.createElement('div');
        el.innerHTML = '<svg'+str;
        let svg = el.querySelector('svg');
        let children = svg.children;
        for (let i = 0; i < children.length; i++) {
          switch (children[i].nodeName) {
            case 'rect': 
                let x = parseFloat(children[i].getAttribute('x'))
                let y = parseFloat(children[i].getAttribute('y'))
                let width = parseFloat(children[i].getAttribute('width'))
                let height = parseFloat(children[i].getAttribute('height'))
                let newRect = new Polygon([
                  [x,y],
                  [x, y + height],
                  [x + width, y + height],
                  [x + width, y]
                ]);
                //console.log(p);
                polys.push(newRect);
              break;
            case 'polyline':
            case 'polygon':
                let points = children[i].getAttribute('points');
                let str = points.replace(/\s*$/,"");
                str = str.split(' ');
                let arr = str.map((v) => v.split(','))
                for (let i = 0; i < arr.length; i++) {
                  arr[i][0] = parseFloat(arr[i][0]);
                  arr[i][1] = parseFloat(arr[i][1]);
                }
                //console.log(arr)
                let newPoly = new Polygon(arr);
                polys.push(newPoly)
              break;
            default:
              break;
          }
        }
    

        console.log('Loading assets...');
        let player = this.make.graphics();
        player.fillStyle(0x5590ab, 1);
        player.fillRect(0, 0, 60, 60);
        player.generateTexture('player', 60, 60);
        player.destroy();

        polys.forEach((poly,i) => {
            let points = poly.toArray();
            let bbox = poly.aabb();
            let padding = poly.offset(-10).toArray()
            let p = this.make.graphics();
            p.beginPath();
            p.fillStyle(0x9b9b9b, 1)
            
            p.moveTo(points[0][0] - bbox.x,points[0][1] - bbox.y);
            for (let i = 1; i < points.length; i++) {
                p.lineTo(points[i][0] - bbox.x, points[i][1] - bbox.y);
            }
            p.closePath();
            p.fillPath();

            p.generateTexture('obj_'+i, bbox.w, bbox.h);
            p.destroy();
        })

        PSD.fromURL('map.psd').then((psd) => {
            let l = 0;
            let children = psd.tree().descendants();
            children.forEach((child,i) => {
                let layer = child.layer;
                if (!layer.visible) return;
                images.push({
                    id: 'layer_'+i,
                    y: layer.top,
                    x: layer.left,
                    width: layer.width,
                    height: layer.height
                })
                l++;
                this.textures.addBase64('layer_'+i, layer.image.toBase64());
            });
            let i = 0;
            this.textures.on('onload', () => {
                i++;
                if (i === l) {
                    this.scene.start('MainScene', {polygons: polys, images: images});
                }
            });
        });

    }

    create() {

    }

    update() {

    }
}
