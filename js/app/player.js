define(['app/avatar'], function(Avatar) {
    class Player {
        constructor() {
            this.avatar = new Avatar();
            //this is the current position
            this.x = 0;
            this.y = 0;

            this.direction = 0;
            this.animate = false;
            this.spriteCount = 0;

            //destination is the cell coords 
            this.middleX = 0;
            this.middleY = 0;
            this.destinationX = 0;
            this.destinationY = 0;
        }

        setAvatar(sprite) {
            this.avatar.setSprite(sprite);
        }

        //
        moveTo(x, y) {
            this.destinationX = x;
            this.destinationY = y;
        }

        //
        moveUpdate() {

        }

        update() {

            if (this.animate) {

                this.animationCount++;
                if (this.animationCount == 2) {
                    this.animationCount = 0;
                }

            }

        }
    }
    return Player;
});