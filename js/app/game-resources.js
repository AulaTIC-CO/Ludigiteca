define(['app/grid'], function(Grid) {
    class GameResoureces {

        constructor(world) {
            this.world = world;
            this.mapData; //root JSON
            this.objectDataMapeado = [];
            this.objectsData = [];
            this.resourceMapped = new Map();
            this.loader = new Loader();
            this.objectURLBase = './resources/gfx/objects/';
            //this.wordURL='./resources/world/1.json';
            this.wordURL = 'map.json';
            this.gridColumns = 42;
            this.gridRows = 42;
        }

        //
        loadData() {
            //console.log('loadData...');
            this.loader.add(this.wordURL) /*.on('progress',this.loadProgressHandler.bind(this))*/ .load(this.mapDataLoaded.bind(this));
        }

        //
        /*loadProgressHandler(loader, resource){
        	console.log('loding...');
        	//Display the file `url` currently being loaded
        	console.log(`loading: ${resource.url}`);
        	//Display the percentage of files currently loaded
        	console.log(`progress: ${loader.progress}`);
        }*/

        //
        mapDataLoaded() {
            console.log('dataLoaded world map.json:' + JSON.stringify(this.loader.resources[this.wordURL].data));
            //'/resources/gfx'
            this.mapData = this.loader.resources[this.wordURL].data;
            let tilesets = this.mapData.tilesets;
            let tilesetsDataURL = [];
            for (let tileset of tilesets) {
                console.log(JSON.stringify(tileset));
                tilesetsDataURL.push(tileset.source);
            }
            this.loader.add(tilesetsDataURL).load(this.objectDataLoad.bind(this));
        }

        //
        objectDataLoad() {
            let objectsURL = [];
            let tilesets = this.mapData.tilesets;
            for (let tileset of tilesets) {
                var objectData = this.loader.resources[tileset.source].data;
                this.objectsData[tileset.firstgid] = objectData;
                let firstId = tileset.firstgid;
                var endId = firstId + objectData.tilecount;
                for (let i = firstId; i < endId; i++) {
                    //console.log('firstgid:'+firstId+' mapeado i:'+i);
                    this.objectDataMapeado[i] = firstId;
                }
                let imgURL = 'resources/gfx/objects/' + objectData.image;
                objectsURL.push(imgURL);
                //console.log("imgURL:"+imgURL);
            }
            this.loader.add(objectsURL).load(this.resourcesLoaded.bind(this));
        }

        //	
        resourcesLoaded() {
            console.log('GameResoureces resourcesLoaded...');
            this.world.resourcesLoaded();
        }

        //
        getLayerMatrix(layerId) {
            let index = 0;
            let layerMatrix = [];
            let layerMatrixT = [];
            let layerArrayData = this.mapData.layers[layerId].data;
            let numColumns = Grid.COLUMNS;
            let numRows = Grid.ROWS;

            for (var i = 0; i < numColumns; i++) {
                layerMatrix[i] = [];
                layerMatrixT[i] = [];
                for (let j = 0; j < numRows; j++) {
                    layerMatrix[i][j] = layerArrayData[index];
                    index++;
                }
            }

            //matrix transform
            for (let k = 0; k < numColumns; k++) {
                for (var l = 0; l < numRows; l++) {
                    layerMatrixT[(numRows - 1) - k][l] = layerMatrix[k][l];
                }
            }
            return layerMatrixT;
        }

        //
        getObject(objectId, column, row) {
            //console.log('objectId:'+objectId+' this.objectDataMapeado:'+this.objectDataMapeado[objectId]);
            let objectIdMapeado = this.objectDataMapeado[objectId];

            //
            let objectData = this.objectsData[objectIdMapeado];
            let numColumn = objectData.columns;
            let tiledIndex = objectId - objectIdMapeado;
            let tileX = tiledIndex % numColumn;
            let tileY = Math.floor(tiledIndex / numColumn);

            //fine
            let midW = (Grid.TILE_WIDTH / 2);
            let midH = (Grid.TILE_HEIGHT / 2);
            let x = (midW * column) + (midW * row);
            let y = (midH * row) + (midH * (Grid.COLUMNS - (column + 1))) + Grid.TILE_HEIGHT;

            let resourceURL = 'resources/gfx/objects/' + objectData.image;

            //console.log('tiledIndex:'+tiledIndex+' oId:'+objectId+' obIdMapeado:'+objectIdMapeado+' tX:'+tileX+' tY:'+tileY);
            //object.type=objectData.type;
            let textures = [];
            let tileRectangle = new Rectangle(tileX * objectData.tilewidth, tileY * objectData.tileheight, objectData.tilewidth, objectData.tileheight);


            let object = new Sprite();
            object.texture = new PIXI.Texture(this.loader.resources[resourceURL].texture, tileRectangle);
            if (objectData.tileoffset) {
                object.pivot.set(-objectData.tileoffset.x, (objectData.tileheight - objectData.tileoffset.y));
            } else {
                object.pivot.set(0, objectData.tileheight);
            }
            object.position.set(x, y);
            object.width = objectData.tilewidth;
            object.height = objectData.tileheight;

            if (objectData.properties) {
                object.type = objectData.properties.type; //dynamic
                //ADD SPRITE INFO HERE DEV*****************************************************
                if (object.type == 'player') {
                    for (let i = 0; i < 8; i++) {
                        textures[i] = [];
                        for (let j = 0; j < 12; j++) {
                            textures[i][j] = this.getTextureSprite(resourceURL, j * objectData.tilewidth, i * objectData.tileheight, objectData.tilewidth, objectData.tileheight);
                        }
                    }
                    object.data2 = {
                        "object": object,
                        "textures": textures,
                        "move": false,
                        "direction": 5,
                        "destinationX": x,
                        "destinationY": y,
                        "animate": false,
                        "currentFrame": 0,
                        "numFrame": 12,
                        "frameUpdate": 3,
                        "frameWait": 0,
                        update() {
                            if (this.animate) {
                                this.frameWait++;
                                if (this.frameWait == this.frameUpdate) {
                                    this.object.texture = this.textures[this.direction][this.currentFrame];
                                    this.currentFrame++;
                                    if (this.currentFrame == this.numFrame) {
                                        //this.animate=false;
                                        this.currentFrame = 1;
                                    }
                                    this.frameWait = 0;
                                }
                            }
                        },
                        animateStop() {
                            this.animate = false;
                            this.object.texture = this.textures[this.direction][0];
                        }
                    };
                } else if (object.type == 'box') {
                    for (let i = 0; i < 22; i++) {
                        textures[i] = this.getTextureSprite(resourceURL, i * objectData.tilewidth, 0, objectData.tilewidth, objectData.tileheight);
                    }
                    object.data2 = {
                        "object": object,
                        "textures": textures,
                        "direction": 0,
                        "destinationX": x,
                        "destinationY": y,
                        "currentFrame": 0,
                        "animate": false,
                        "numFrame": 22,
                        "frameUpdate": 2,
                        "frameWait": 0,
                        update() {
                            if (this.animate) {
                                this.frameWait++;
                                if (this.frameWait == this.frameUpdate) {
                                    this.object.texture = this.textures[this.currentFrame];
                                    this.currentFrame++;
                                    if (this.currentFrame == this.numFrame) {
                                        this.animate = false;
                                        this.object.visible = false;
                                        this.currentFrame = 0;
                                    }
                                    this.frameWait = 0;
                                }
                            }
                        },
                        reset() {
                            this.object.visible = true;
                            this.object.texture = this.textures[this.currentFrame];
                        }
                    };
                }
            }

            //console.log('getObject resourceURL:'+resourceURL+' width:'+objectData.imagewidth+' x:'+x+' y:'+y);

            return object;
        }

        getTextureSprite(resourceURL, x, y, width, height) {
            let tileRectangle = new Rectangle(x, y, width, height);
            return new PIXI.Texture(this.loader.resources[resourceURL].texture, tileRectangle);
        }
    }

    return GameResoureces;
});