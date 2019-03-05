//Aliases, los dejo por fuera para que ruleta los pueda usar tambien
var autoDetectRenderer = PIXI.autoDetectRenderer;
//var loader = PIXI.loader;

var Loader = PIXI.loaders.Loader; //new

var resources = PIXI.loader.resources;
var Container = PIXI.Container;
var ParticleContainer = PIXI.ParticleContainer;
var Text = PIXI.Text;
var Sprite = PIXI.Sprite;
let Graphics = PIXI.Graphics;
var Texture = PIXI.Texture;
var Rectangle = PIXI.Rectangle;
var Point = PIXI.Point;

//GLOBALS TEMP
var global_world = {}; //temp just for test
var global_camera = {}; //temp just for test
var global_point = {}; //temp just for test

var positionX = (x, y) => {
    let gridColumns = 42;

    let widht = 84;
    let height = 42;
    let midH = (height / 2);
    let midW = (widht / 2);
    let x2 = midW + (midW * x) + (midW * y);
    let y2 = (midH * y) + (midH * (gridColumns - (x + 1))) + midH;

    global_point.x = x2;
    global_point.y = y2;
}
/*
let Ease=createjs.Ease;
*/

//
var renderer;
var stage;

require.config({
    baseUrl: 'js/lib',
    paths: {
        'app': '../app'
    }
});


require(['app/game'], function(Game) {
    stage = new Container();
    renderer = autoDetectRenderer(800, 600);
    renderer.backgroundColor = 0x0000FF;
    document.getElementById('canvasContainer').appendChild(renderer.view);
    renderer.render(stage);

    let game = new Game();
    game.init();
    //app.init();
});