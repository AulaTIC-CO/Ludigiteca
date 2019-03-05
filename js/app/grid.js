define(function() {
    class Grid {
        static get COLUMNS() {
            return 42;
        }

        static get ROWS() {
            return 42;
        }

        static get WIDTH() {
            return 42;
        }

        static get HEIGHT() {
            return 42;
        }

        static get TILE_WIDTH() {
            return 84;
        }

        static get TILE_HEIGHT() {
            return 42;
        }

        static getTilePos(column, row) {
            let midW = (Grid.TILE_WIDTH / 2);
            let midH = (Grid.TILE_HEIGHT / 2);
            let tileX = (midW * column) + (midW * row);
            let tileY = (midH * row) + (midH * (Grid.COLUMNS - (column))) + midH;
            let tileIndex = row + (Grid.COLUMNS - (column + 1));

            return {
                "tileX": tileX,
                "tileY": tileY,
                "tileIndex": tileIndex
            };
        }

        static getTilePosCenter(column, row, scale) {
            let midW = (Grid.TILE_WIDTH / 2);
            let midH = (Grid.TILE_HEIGHT / 2);
            let tileX = (midW * column) + (midW * row) + midW;
            let tileY = (midH * row) + (midH * (Grid.COLUMNS - (column))) - midH;

            return {
                "tileX": tileX * scale,
                "tileY": tileY * scale
            };
        }

        /*static calculateTilePosx(globalX,globalY){
            let x=(-(Grid.dy-globalY)+Grid.b)/Grid.m;
            let y=(-(Grid.dy-globalY)+Grid.b)/Grid.m;
            
            let column=Math.floor((globalX-x)/Grid.TILE_WIDTH);
            let row=Math.floor((globalY-y)/Grid.TILE_WIDTH);
            return {"gridColumn":column,"gridRow":row};
        }
        
        static setGlobals(){
            Grid.b1=0;
            Grid.b2=0;
            Grid.m1=0;
            Grid.m2=0;
        }*/

        static calculateTilePos(globalX, globalY) {
            console.log('globalX:' + globalX + ' globalY:' + globalY);

            let midW = (Grid.TILE_WIDTH / 2);
            let point1 = Grid.getTilePos(0, 0);
            let point2 = Grid.getTilePos(0, Grid.ROWS - 1);
            let dy = point2.tileY; //i need convert the max Y in zero

            //update every Y(invert the value)
            globalY = dy - globalY;
            point1.tileY = dy - point1.tileY;
            point2.tileY = dy - point2.tileY;

            /*console.log('point1:'+JSON.stringify(point1));
            console.log('point2:'+JSON.stringify(point2));*/

            let b = point1.tileY;
            let m = (point2.tileY - point1.tileY) / ((point2.tileX + midW) - point1.tileX);

            let x = (-(dy - globalY) + b) / m;
            //console.log(`globalX-x:${globalX}-${x}`);
            let column = Math.floor(((globalX - x) + midW) / Grid.TILE_WIDTH);
            console.log('m:' + m + ' b:' + b);

            //----------------------------------------------------
            let midH = (Grid.TILE_HEIGHT / 2);
            point2 = Grid.getTilePos(Grid.COLUMNS - 1, 0 /*Grid.ROWS-1*/ );
            dy = point2.tileY; //i need convert the max Y in zero

            //update every Y(invert the value)
            globalY = dy - globalY;
            point2.tileY = dy - point2.tileY;

            b = point1.tileY;
            m = ((point2.tileY + midH) - point1.tileY) / ((point2.tileX /*+midW*/ ) - point1.tileX);

            let y = b + (m * globalX);
            let row = (Grid.ROWS - 1) + Math.floor(((globalY - y) /*-midH*/ ) / Grid.TILE_HEIGHT);
            console.log('m:' + m + ' b:' + b);

            console.log('grid.calculateTilePos column:' + column + ' row:' + row);

            return {
                "column": column,
                "row": row
            };
        }

        /*static getTileIndex(x,y){
            return y+(Grid.COLUMNS-(x+1));
        }*/
    }

    Grid.midW = (Grid.TILE_WIDTH / 2);

    return Grid;
});