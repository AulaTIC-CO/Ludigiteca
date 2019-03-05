define(['app/world', 'app/tools', 'app/preloader'], function(World, Tools, Preloader) {

    class Game {

        constructor() {
            this.resourcesCount = 0;
            this.world = new World(this);
            global_world = this.world; //TEMP
            this.tools = new Tools(this);
            this.preloader = new Preloader();
        }

        //
        init() {
            console.log('game init');
            stage.addChild(this.world.stage);
            stage.addChild(this.tools.container);
            stage.addChild(this.preloader.curtain);

            this.tools.init();
            this.world.init();
            this.preloader.init();

            renderer.render(stage);
        }

        //
        resourcesLoaded() {
            this.resourcesCount++;
            if (this.resourcesCount == 2) {
                this.startGame();
            }
        }

        //
        startGame() {
            this.tools.minimap.init(this.world.mapTexture);
            this.preloader.hide();
            this.updateGame();
        }

        //
        addItem() {
            this.tools.addItem();
        }

        //
        updateGame() {
            //console.log('updateStage');
            requestAnimationFrame(this.updateGame.bind(this));
            this.world.updateWorld();
            renderer.render(stage);
        }

    }

    return Game;
});