define(function() {
    class Minimap {
        constructor() {
            this.container = new Container();
            this.map = new Sprite();
        }

        init(minimapTexture) {
            console.log('minimapTexture:' + minimapTexture);
            let containerWidth = 300;
            let containerHeight = 300;
            this.map.texture = minimapTexture;
            this.map.scale.set(.08);
            console.log("this.map.width:" + this.map.width);
            this.map.position.set((containerWidth / 2) - (this.map.width / 2), (containerHeight / 2) - (this.map.height / 2));
            this.container.addChild(this.map);
        }

        show() {
            this.container.visible = true;
        }

        hide() {
            this.container.visible = false;
        }

        center(x, y) {

        }
    }
    return Minimap;
});