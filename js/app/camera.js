define(['app/grid'], function(Grid) {
    class Camera {
        constructor(worldContainer) {
            this.worldContainer = worldContainer;
            this.viewportWidth = 800;
            this.viewportHegith = 600;
            this.scale = 1;
        }

        set zoom(scale) {
            this.scale = scale;
            this.worldContainer.scale.set(this.scale);
        }

        //
        center(x, y) {
            let {
                tileX,
                tileY
            } = Grid.getTilePosCenter(x, y, this.scale);

            this.worldContainer.x = (this.viewportWidth / 2) - tileX;
            this.worldContainer.y = (this.viewportHegith / 2) - tileY;
        }
    }
    return Camera;
});