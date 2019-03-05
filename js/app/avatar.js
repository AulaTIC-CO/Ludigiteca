define(function() {
    class Avatar {
        constructor() {
            this.sprite;
        }

        setSprite(sprite) {
            this.sprite = sprite;
        }

        //i think this is not necessary???
        updateDirection() {

        }

        //0:left,1:up,2:right,3:dowm
        updateFrame(direction) {
            switch (direction) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break
                default:
                    console.log('stop');
            }
        }
    }
    return Avatar;
});