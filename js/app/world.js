define(['app/grid', 'app/game-resources' /*,'app/object-factory'*/ , 'app/camera', 'app/player'], function(Grid, GameResources, Camera, Player) {
    class World {

        constructor(game) {

            this.Grid = Grid; //TEMP

            this.game = game;

            this.gameResources = new GameResources(this);
            //this.objectFactory=new ObjectFactory();
            this.worldContainer = new Container();
            this.camera = new Camera(this.worldContainer);
            global_camera = this.camera; //TEMP
            this.stage = new Container();

            //
            /*this.gridColumns=42;
            this.gridRows=42;
            this.tileWidht=84;
            this.tileHeight=42;*/
            /*this.gridHeight=((this.tileHeight/2)*this.gridRows)+((this.tileHeight/2)*(this.gridColumns-this.gridColumns));
            this.gridWidth=this.tileWidht+((this.tileWidht/2)*this.gridColumns)+((this.tileWidht/2)*this.gridRows);*/

            this.objects = []; //this matrix save the object in his overlap position
            this.objectsPosition = [];
            for (let i = 0; i < Grid.ROWS; i++) {
                this.objects[i] = [];
            }

            this.objectContainer = new Container /*ParticleContainer*/ ();
            this.groundContainer1 = new Container();
            this.groundContainer0 = new Container(); //particle container change this

            //
            this.groundLayerMatrix0 = [];
            this.groundLayerMatrix1 = [];
            this.objectLayerMatrix = [];
            this.mapTexture;
            this.lootBoxSlots = [
                [36, 7],
                [34, 38],
                [0, 40]
            ];
            this.lootBoxCurrentSlot = 0;
            this.box;

            //Objects+Players
            this.localPlayer /*=new Player()*/ ;
            this.players = [];
            this.destinationTile = {
                'column': 0,
                'row': 0
            };

            //Events bind
            this.moveEvent = null;

            //TEMP
            this.pointX = new Graphics();
            this.pointX.beginFill(0xFF0000);
            this.pointX.drawCircle(4, 4, 8);
            this.pointX.endFill();
            global_point = this.pointX;
        }

        //
        init() {
            this.groundContainer0.y = this.groundContainer1.y = this.objectContainer.y = 0; //temp    
            this.worldContainer.addChild(this.groundContainer0);
            this.worldContainer.addChild(this.groundContainer1);
            this.worldContainer.addChild(this.objectContainer);

            this.worldContainer.addChild(this.pointX);

            this.stage.addChild(this.worldContainer);

            this.gameResources.loadData();
        }

        //
        resourcesLoaded() {
            console.log('World resourcesLoaded:' + this.gameResources.objectsData);
            this.generateWorldStage();
            this.activateEvents();
        }

        //
        generateWorldStage() {
            this.groundLayerMatrix0 = this.gameResources.getLayerMatrix(0);
            this.drawLayerObjects(this.groundLayerMatrix0);

            this.groundLayerMatrix1 = this.gameResources.getLayerMatrix(1);
            this.drawLayerObjects(this.groundLayerMatrix1);

            this.objectLayerMatrix = this.gameResources.getLayerMatrix(2);
            this.drawLayerObjects(this.objectLayerMatrix, true);

            this.mapTexture = renderer.generateTexture(this.worldContainer);
            //this.localPlayer.visible=true;
            this.game.resourcesLoaded();
        }

        //
        drawLayerObjects(layerMatrix, register = false) {
            let numColumns = Grid.COLUMNS;
            let numRows = Grid.ROWS;
            for (let i = numColumns - 1; i > -1; i--) {
                for (let j = 0; j < numRows; j++) {
                    if (layerMatrix[i][j] != 0) {
                        let object = this.gameResources.getObject(layerMatrix[i][j], i, j);
                        this.objectContainer.addChild(object);
                        if (register) {
                            this.objects[i][j] = object;
                            let pos = {
                                "column": i,
                                "row": j,
                                "index": j + (Grid.COLUMNS - (i + 1))
                            };
                            this.objectsPosition.push(pos); //update for reference

                            //change the type for a number type in the future
                            console.log('object.type:' + object.type);
                            if (object.type == 'player') {
                                object.pos = pos;
                                this.localPlayer = object;
                                //this.localPlayer.data2
                                //this.localPlayer.visible=false;
                            } else if (object.type == 'box') {
                                console.log('box');
                                object.pos = pos;
                                this.box = object;
                                //object.interactive=true;
                                //object.on('click',this.getBox.bind(this));
                            }
                        }
                        //console.log('object.texture:'+object.texture);
                    }
                }
            }
        }

        //
        //this.worldContainer

        //
        activateEvents() {
            console.log('world activateEvents');
            this.stage.interactive = true;
            let ground = this.worldContainer; //this.stage;//this.stage.getChildAt(0);
            ground.interactive = true;
            this.moveEvent = this.move.bind(this);
            ground.mousedown = this.moveEvent;
            this.camera.center(24, 14);
            //this.stage.on('click',this.handleClick.bind(this))
        }

        move(e) {
            let global = e.data.global;
            /*console.log('---------------------------');
            console.log('e.data:'+JSON.stringify(e.data));
            console.log('global.x:'+global.x+' global.y:'+global.y);
            console.log('---------------------------');*/
            let {
                column,
                row
            } = Grid.calculateTilePos(global.x - this.worldContainer.x, global.y - this.worldContainer.y);

            if (column >= 0 && column < Grid.COLUMNS && row >= 0 && row < Grid.ROWS) {
                if (!this.objects[column][row] || this.objects[column][row].type == 'box') {
                    this.destinationTile.column = column;
                    this.destinationTile.row = row;
                    this.moveTo();
                    //this.validateCaptureBox(column,row);
                }
                this.camera.center(column, row);
            }
        }

        //****************************************************************************************//
        //****************************************************************************************//
        //****************************************************************************************//
        //
        moveTo() {
            let nextTilePos = this.nextTile(this.localPlayer.pos, this.destinationTile);

            if (nextTilePos.column != this.localPlayer.pos.column || nextTilePos.row != this.localPlayer.pos.row) {
                console.log('nextTilePos:' + JSON.stringify(nextTilePos));

                //
                this.localPlayer.data2.direction = nextTilePos.direction /*this.getDirection(this.localPlayer.pos,nextTilePos)*/ ;
                console.log('this.localPlayer.data2.direction:' + this.localPlayer.data2.direction);

                let {
                    tileX,
                    tileY,
                    tileIndex
                } = Grid.getTilePos(nextTilePos.column, nextTilePos.row);
                /*this.localPlayer.x=tileX;
                this.localPlayer.y=tileY;*/

                this.localPlayer.data2.destinationX = tileX;
                this.localPlayer.data2.destinationY = tileY;
                this.localPlayer.data2.move = true;
                this.localPlayer.data2.animate = true;

                console.log('x:' + this.localPlayer.pos.column, ' y:' + this.localPlayer.pos.row);
                let ix = this.localPlayer.pos.column;
                let iy = this.localPlayer.pos.row;

                this.localPlayer.pos.column = nextTilePos.column;
                this.localPlayer.pos.row = nextTilePos.row;
                this.localPlayer.pos.index = tileIndex;
                this.objects[nextTilePos.column][nextTilePos.row] = this.localPlayer;
                this.objects[ix][iy] = null;

                /*if(typeof this.objects[x][y]=='array'){
                    this.objects[x][y].push(this.localPlayer);
                }*/
            } else {
                this.localPlayer.data2.move = false;
                this.localPlayer.data2.animateStop();
            }
        }
        //nextTile  updatePosition getDirection

        //
        nextTile(currentTile, destinationTile) {
            let currentColumn = currentTile.column;
            let currentRow = currentTile.row;
            let destinationColumn = destinationTile.column;
            let destinationRow = destinationTile.row;

            let nextColumn = currentColumn;
            let nextRow = currentRow;

            let deviationColumn = 0;
            let deviationRow = 0;

            let direction = 0;

            let direction0 = true;
            let direction1 = true;
            let direction2 = true;
            let direction3 = true;
            let direction4 = true;
            let direction5 = true;
            let direction6 = true;
            let direction7 = true;

            let maxIteration = 3;

            console.log('currentTile:' + JSON.stringify(currentTile) + 'destinationTile:' + JSON.stringify(destinationTile));

            console.log('begin selection tile----------------------------');
            while (maxIteration--) {

                if (currentColumn > destinationColumn + deviationColumn && currentRow == destinationRow + deviationRow && direction0) {
                    console.log('direction0');
                    direction0 = false;
                    direction = 7; //0;
                    nextColumn = currentColumn - 1;
                } else if (currentColumn > destinationColumn + deviationColumn && currentRow > destinationRow + deviationRow && direction1) {
                    console.log('direction1');
                    direction1 = false;
                    direction = 0; //1;
                    nextColumn = currentColumn - 1;
                    nextRow = currentRow - 1;
                } else if (currentColumn == destinationColumn + deviationColumn && currentRow > destinationRow + deviationRow && direction2) {
                    console.log('direction2');
                    direction2 = false;
                    direction = 1; //2;
                    nextRow = currentRow - 1;
                } else if (currentColumn < destinationColumn + deviationColumn && currentRow > destinationRow + deviationRow && direction3) {
                    console.log('direction3');
                    direction3 = false;
                    direction = 2; //3;
                    nextColumn = currentColumn + 1;
                    nextRow = currentRow - 1;
                } else if (currentColumn < destinationColumn + deviationColumn && currentRow == destinationRow + deviationRow && direction4) {
                    console.log('direction4');
                    direction4 = false;
                    direction = 3; //4;
                    nextColumn = currentColumn + 1;
                } else if (currentColumn < destinationColumn + deviationColumn && currentRow < destinationRow + deviationRow && direction5) {
                    console.log('direction5');
                    direction5 = false;
                    direction = 4; //5;
                    nextColumn = currentColumn + 1;
                    nextRow = currentRow + 1;
                } else if (currentColumn == destinationColumn + deviationColumn && currentRow < destinationRow + deviationRow && direction6) {
                    console.log('direction6');
                    direction6 = false;
                    direction = 5; //6;
                    nextRow = currentRow + 1;
                } else if (currentColumn > destinationColumn + deviationColumn && currentRow < destinationRow + deviationRow && direction7) {
                    console.log('direction7');
                    direction7 = false;
                    direction = 6; //7;
                    nextColumn = currentColumn - 1;
                    nextRow = currentRow + 1;
                }

                let tileObject = this.objects[nextColumn][nextRow];
                if (destinationTile.column == nextColumn && destinationTile.row == nextRow && tileObject != null) {
                    console.log('selection end----------------------------:' + tileObject);
                    break;
                }


                if (nextColumn >= 0 && nextColumn < Grid.COLUMNS && nextRow >= 0 && nextRow < Grid.ROWS && tileObject == null) {
                    console.log('selection end----------------------------:' + tileObject);
                    break;
                } else {
                    switch (direction) {
                        case 7:
                            deviationColumn++
                            deviationRow++;
                            break;
                        case 0:
                            deviationColumn++
                            deviationRow++;
                            break;
                        case 1:
                            deviationColumn++
                            deviationRow++;
                            break;
                        case 2:
                            deviationColumn++
                            deviationRow++;
                            break;
                        case 3:
                            deviationColumn++
                            deviationRow++;
                            break;
                        case 4:
                            deviationColumn++
                            deviationRow++;
                            break;
                        case 5:
                            deviationColumn++
                            deviationRow++;
                            break;
                        case 6:
                            deviationColumn++
                            deviationRow++;
                            break;
                    }
                }
            }
            direction0 = direction1 = direction2 = direction3 = direction4 = direction5 = direction6 = direction7 = true;

            if (destinationTile.column == nextColumn && destinationTile.row == nextRow) {
                let tileObject = this.objects[destinationTile.column][destinationTile.row];
                if (tileObject != null && tileObject.type == 'box') {
                    this.validateCaptureBox(destinationTile.column, destinationTile.row);
                    destinationTile.column = currentColumn;
                    destinationTile.row = currentRow;
                    nextColumn = currentColumn;
                    nextRow = currentRow;
                }
            }


            return {
                "column": nextColumn,
                "row": nextRow,
                "direction": direction
            };
        }

        //DEV HERE
        /*getDirection(pos1,pos2){
            if(pos1.column-1==pos2.column2&&pos1.row==pos2.row2){
                return 0;
            }else if(pos1.column-1==pos2.column2&&pos1.row-1==pos2.row2){
                return 1;
            }else if(pos1.column==pos2.column2&&pos1.row-1==pos2.row2){
                return 2;   
            }else if(pos1.column+1==pos2.column2&&pos1.row-1==pos2.row2){
                return 3;
            }else if(pos1.column+1==pos2.column2&&pos1.row==pos2.row2){
                return 4;
            }else if(pos1.column+1==pos2.column2&&pos1.row+1==pos2.row2){
                return 5;
            }else if(pos1.column==pos2.column2&&pos1.row+1==pos2.row2){
                return 6;
            }else if(pos1.column-1==pos2.column2&&pos1.row+1==pos2.row2){
                return 7;
            }
            return 0;
        }*/

        //
        updatePosition(object) {
            if (object.data2.move && (object.x != object.data2.destinationX || object.y != object.data2.destinationY)) {
                switch (object.data2.direction) {
                    /*case 0:
                        object.x-=2;
                        object.y+=1;
                        break;
                    case 1:
                        object.x-=2;
                        break;
                    case 2:
                        object.x-=2;
                        object.y-=1;
                        break;
                    case 3:
                        object.y-=2; 
                        break;
                    case 4:
                        object.x+=2;
                        object.y-=1; 
                        break;
                    case 5:
                        object.x+=2; 
                        break;
                    case 6:
                        object.x+=2;
                        object.y+=1; 
                        break;
                    case 7:
                        object.y+=2; 
                        break;*/

                    case 7:
                        object.x -= 2;
                        object.y += 1;
                        break;
                    case 0:
                        object.x -= 2;
                        break;
                    case 1:
                        object.x -= 2;
                        object.y -= 1;
                        break;
                    case 2:
                        object.y -= 2;
                        break;
                    case 3:
                        object.x += 2;
                        object.y -= 1;
                        break;
                    case 4:
                        object.x += 2;
                        break;
                    case 5:
                        object.x += 2;
                        object.y += 1;
                        break;
                    case 6:
                        object.y += 2;
                        break;
                }
                //console.log("x:"+object.x+" destinationX"+object.data2.destinationX);
                //console.log("y:"+object.y+" destinationY"+object.data2.destinationY);
                //
                if (object.x == object.data2.destinationX && object.y == object.data2.destinationY) {
                    if (this.localPlayer.pos.column != this.destinationTile.column || this.localPlayer.pos.row != this.destinationTile.row) {
                        this.moveTo();
                    } else {
                        object.data2.move = false;
                        this.localPlayer.data2.animateStop();
                    }
                }
            }

            /*if(this.localPlayer.pos.column!=this.destinationTile.column||this.localPlayer.pos.row!=this.destinationTile.row){
                setTimeout(this.moveTo.bind(this),1000);
            }*/
        }

        //****************************************************************************************//
        //****************************************************************************************//
        //****************************************************************************************//

        //
        validateCaptureBox(column, row) {
            if (this.objects[column] && this.objects[column][row] && this.objects[column][row].type == "box") {
                console.log('this.objects[column][row].type:' + this.objects[column][row].type);
                //this.objects[column][row]=null;
                this.box.data2.animate = true;
                this.changeBoxPosition();
            }
        }

        //
        changeBoxPosition( /*e*/ ) {
            //let box=e.currentTarget;
            if (this.lootBoxCurrentSlot < 2) {
                //this.box.visible=false;

                setTimeout(() => {
                    this.lootBoxCurrentSlot++;

                    //console.log(Object.getOwnPropertyNames(this.box.data2));
                    this.box.data2.reset();
                    this.box.visible = true;
                    let [column, row] = this.lootBoxSlots[this.lootBoxCurrentSlot];
                    let {
                        tileX,
                        tileY,
                        tileIndex
                    } = Grid.getTilePos(column, row);
                    this.box.x = tileX;
                    this.box.y = tileY;

                    this.box.pos.column = column;
                    this.box.pos.row = row;
                    this.box.pos.index = tileIndex;

                    this.objects[column][row] = this.box;
                }, 4000 * Math.random());
                this.game.addItem();
            }
        }

        //	
        updateWorld() {
            /*for(let i=this.gridColumns-1;i>-1;i--){
                for(let j=0;j<this.gridRows;j++){
                    let object=this.objects[i][j];
                    if(object){
                        //this.objectContainer.removeChild(object);
                        this.objectContainer.addChild(object);
                    }
                }
			}*/

            this.box.data2.update();
            this.localPlayer.data2.update();
            this.updatePosition(this.localPlayer);

            this.objectsPosition.sort((obj1, obj2) => {
                return obj1.index - obj2.index;
            });

            let numObjects = this.objectsPosition.length;
            for (let j = 0; j < numObjects; j++) {
                let pos = this.objectsPosition[j];
                let object = this.objects[pos.column][pos.row];
                //object.alpha=0.5;
                this.objectContainer.addChild(object);
                //this.objectContainer.removeChild(object);
            }
        }

    }
    return World;
});