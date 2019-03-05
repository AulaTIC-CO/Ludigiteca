define(function() {
    class Preloader {
        constructor() {
            this.curtain = new Container();
        }

        init() {
            let background = new Graphics();
            background.beginFill(0x000000);
            background.drawRect(0, 0, 800, 600);
            background.endFill();
            this.curtain.addChild(background);

            let text = new Text();
            text.style = {
                "fontFamily": 'Arial',
                "fontSize": 20,
                "fill": 0xFFFFFF,
                "align": 'center'
            };
            text.text = 'cargando...';
            text.position.set(10, 570);
            this.curtain.addChild(text);
        }

        show() {
            this.curtain.visible = true;
        }

        hide() {
            this.curtain.visible = false;
        }
    }
    return Preloader;
});