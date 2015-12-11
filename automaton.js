//noinspection ThisExpressionReferencesGlobalObjectJS
/**
 * Created by Matthieu on 18/11/2015.
 */

this.Automaton = {};

(function automaton (automaton) {

    /**
     * Implementation of the Game of life
     * {@link https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life}
     * @type {{init: conway.init, execute: conway.execute, update: conway.update}}
     */
    var conway = {
        /**
         *
         * @param {number} i    line
         * @param {number} j    column
         * @returns {{x: number, y: number, state: number, nextState: number}}
         */
        init: function(i, j){
            var s = Math.round(Math.random());
            return {x: i, y: j, state: s, nextState: s};

        },
        /**
         *
         * @param i
         * @param j
         * @param cell
         * @param auto
         */
        execute: function(i, j, cell, auto){
            var neigh = auto.getNeigh(i, j);
            var alive = -cell.state;
            neigh.forEach(function(e){
                alive = alive + e.state;
            });

            if(cell.state == 0){
                if(alive == 3){
                    cell.nextState = 1;
                }else{
                    cell.nextState = 0;
                }
            }else{
                if(alive == 2 || alive == 3){
                    cell.nextState = 1;
                }else{
                    cell.nextState = 0;
                }
            }
        },
        /**
         *
         * @param x
         * @param y
         * @param cell
         */
        update: function(x, y, cell) {
            cell.state = cell.nextState;
        }
    };



    /**
     * Simple way to draw a square on a canvas
     * @param surfaceId     HTML ID of the canvas
     * @returns {{}}
     */
    automaton.drawableSurface = function(surfaceId){
        var that = {};

        var c = document.getElementById(surfaceId);
        var context = c.getContext("2d");

        /**
         *
         * @param x         position on x-axis
         * @param y         position on y-axis
         * @param width     square's width
         * @param height    square's height
         * @param color     square's color
         */
        that.drawSquare = function(x, y, width, height, color){
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        };

        /**
         *  Size of the canvas (width and height attributes in html/css)
         * @returns {number[]}
         */
        that.getSize = function(){
            return [c.width, c.height];
        };

        return that;
    };

    /**
     *  Automaton. Main object that allows to execute a cellular automaton. For now, it only executes
     *  the well-know Conway Automaton
     * @param  {{surfaceId: string, freqUpdate: number, numberElements: number[], colors: string[]}} params
     * @returns {{}}
     */
    automaton.automata = function(params){
        var that = {};

        var drawSurface = automaton.drawableSurface(params.surfaceId);
        var surfaceSize = drawSurface.getSize();

        var freqUpdate = params.freqUpdate || 1000;
        var colors = params.colors || ['blue', 'white', 'green'];

        var w = params.numberElements[0];
        var wStep = Math.floor(surfaceSize[0] / w);
        var h = params.numberElements[1];
        var hStep = Math.floor(surfaceSize[1] / h);

        var cells = [];

        var animating = false;

        /**
         * Explore the direct neighbourhood of the given cell and add all cell to the array
         * @param x     x location on the automaton
         * @param y     y location on the automaton
         * @returns {Array} where each entry correspond to a cell
         */
        that.getNeigh = function(x, y){
            var neigh = [];
            for(var i = x-1; i <= x+1; i++){
                for(var j = y-1; j <= y+1; j++){
                    neigh.push(cells[(i+w)%w][(j+h)%h]);
                }
            }

            return neigh;
        };

        /**
         * Apply the given action to all cell. Call action with its position and the current cell
         * @param action    action(x, y, cell)
         */
        var applyAll = function(action){
            for(var i = 0; i < w; i++){
                for(var j = 0; j < h; j++){
                    action(i, j, cells[i][j]);
                }
            }
        };

        /**
         * Same as applyAll with the current automaton as the last parameter
         * @param action takes x, y, cell and automaton
         */
        var executeAll = function(action){
            for(var i = 0; i < w; i++){
                for(var j = 0; j < h; j++){
                    action(i, j, cells[i][j], that);
                }
            }
        };

        /**
         * Allows to init all cells of the automaton
         * @param actionInit must return an object to bet set on each cells
         */
        var initAll = function(actionInit){
            for(var i = 0; i < w; i++){
                cells.push([]);
                for(var j = 0; j < h; j++){
                    cells[i].push(actionInit(i, j));
                }
            }
        };

       var displayAll = function(){
           applyAll(function(x, y, cell){
               drawSurface.drawSquare( x * wStep, y * hStep,
                                       wStep, hStep,
                                        colors[cell.state]);
           });
       };

        /**
         *  Make the animation, make one step each time it is called
         *  Stop when animating is set to false
         */
        var next = function(){
            if(animating){
                setTimeout(function(){
                    executeAll(conway.execute);
                    applyAll(conway.update);
                    displayAll();
                    next();
                }, freqUpdate);
            }
        };

        /**
         * Start the automaton. Do nothing if the automaton is already running
         */
        that.start = function(){
            if(!animating){
                animating = true;
                next();
            }
        };

        /**
         * Stop the automaton. Do nothing if the automaton is already running
         */
        that.stop = function(){
            animating = false;
        };

        // init and display all for the first time
        initAll(conway.init);
        displayAll();

        return that;
    }

})(Automaton);