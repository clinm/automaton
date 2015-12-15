//noinspection ThisExpressionReferencesGlobalObjectJS
/**
 * Created by Matthieu on 18/11/2015.
 */

this.Automaton = {};

(function automaton (automaton) {

    /**
     * Coming from "Javascript- The good parts"
     * @param value         The variable to test
     * @returns {*|boolean} True if it is an array, false otherwise
     */
    var is_array = function (value) {
        return value && typeof value === 'object' &&
                    typeof value.length === 'number' &&
                    typeof value.splice === 'function' &&
                    !(value.propertyIsEnumerable('length'));
    };

    /**
     * As describe in this article: https://en.wikipedia.org/wiki/Life-like_cellular_automaton
     * Use the generic rules to create a lot of Automata
     * @param {number[]} birth         array containing all numbers of neighbour correct to emerge
     * @param {number[]} survival      array containing all numbers of neighbour needed to stay alive
     * @returns {{execute: execute}}   a simple object containing a matching execute function for the Automaton
     */
    var lifeLike = function(birth, survival){
        return {
            execute: function(i, j, cell, auto){
                var neigh = auto.getNeigh(i, j);
                var alive = -cell.state;
                neigh.forEach(function(e){
                    alive = alive + e.state;
                });

                cell.nextState = 0;
                if(cell.state == 0){
                    if(birth.indexOf(alive) != -1){
                        cell.nextState = 1;
                    }
                }else{
                    if(survival.indexOf(alive) != -1){
                        cell.nextState = 1;
                    }
                }
            },
            /**
             *
             * @param {number} i    line
             * @param {number} j    column
             * @returns {{x: number, y: number, state: number, nextState: number}}
             */
            init : function(i, j){
                var s = Math.round(Math.random());
                return {x: i, y: j, state: s, nextState: s};

            },

            /**
             *
             * @param x
             * @param y
             * @param cell
             */
            update : function(x, y, cell) {
                cell.state = cell.nextState;
            }
        }
    };

    /**
     * Implementation of the Game of life
     * {@link https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life}
     * @type {{init: conway.init, execute: conway.execute, update: conway.update}}
     */
    var conway = function(){
        return Object.create(lifeLike([3],[2, 3]));
    };

    /**
     * {@link https://en.wikipedia.org/wiki/Seeds_(cellular_automaton)}
     * @returns {Object}
     */
    var seeds = function(){
        return Object.create(lifeLike([2], []));
    };

    var replicator = function(){
        return Object.create(lifeLike([1,3,5,7], [1,5,7]))
    };

    /**
     * {@link https://en.wikipedia.org/wiki/Highlife_(cellular_automaton)}
     * @returns {Object}
     */
    var highlife= function(){
        return Object.create(lifeLike([3, 6],[2, 3]));
    };

    /**
     * Containing all cells available
     * @type {{conway: *, seeds: Object, replicator, highlife: Object}}
     */
    var CELLULARS = {'conway': conway(), 'seeds' : seeds(), 'replicator': replicator(), 'highlife': highlife()};

    /**
     * Default number of cells on each axis
     * @type {number}
     */
    var NUMBER_CELLS = 10;

    var LIFE_LIKE_KEY_WORD = 'lifelike';

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
     * @param  {{surfaceId: string, freqUpdate: number, numberElements: number[], colors: string[],
      *             auto: string, circular: boolean}} params
     * @returns {{}}
     */
    automaton.automata = function(params){
        var that = {};

        var drawSurface = automaton.drawableSurface(params.surfaceId);
        var surfaceSize = drawSurface.getSize();

        var freqUpdate = params.freqUpdate || 1000;
        var colors = params.colors || ['#D1D1D1', '#DD5856'];

        var circular = params.circular || false;

        // default values for number of cells
        var w = Math.ceil(surfaceSize[0] / NUMBER_CELLS);
        var wStep = 10;
        var h = Math.ceil(surfaceSize[1] / NUMBER_CELLS);
        var hStep = 10;

        if(params.numberElements){
            w =  params.numberElements[1];
            wStep = Math.ceil(surfaceSize[0] / w);
            h = params.numberElements[1];
            hStep = Math.ceil(surfaceSize[1] / h);
        }

        var cell = CELLULARS['conway'];
        if(is_array(params.auto)){
            if(params.auto[0] === LIFE_LIKE_KEY_WORD){
                cell = Object.create(lifeLike(params.auto[1], params.auto[2]))|| cell;
            }
        }else{
            cell = params.auto && CELLULARS[params.auto] || cell;
        }

        var cells = [];

        var animating = false;

        /**
         * Explore the direct neighbourhood of the given cell and add all cell to the array
         * This function is circular, meaning that a cell in (0,0) will see at (h-1,0) and (0,w-1)
         * @param x     x location on the automaton
         * @param y     y location on the automaton
         * @returns {Array} where each entry correspond to a cell
         */
        var getNeighCircular = function(x, y){
            var neigh = [];
            for(var i = x-1; i <= x+1; i++){
                for(var j = y-1; j <= y+1; j++){
                    neigh.push(cells[(i+w)%w][(j+h)%h]);
                }
            }

            return neigh;
        };

        /**
         * Explore the direct neighbourhood of the given cell and add all cell to the array
         * This function is NOT circular
         * @param x     x location on the automaton
         * @param y     y location on the automaton
         * @returns {Array} where each entry correspond to a cell, may have less than 8 entries
         */
        var getNeighNonCircular = function(x, y){
            var neigh = [];
            for(var i = Math.max(x-1, 0); i <= Math.min(x+1, w-1); i++){
                for(var j = Math.max(y-1, 0); j <= Math.min(y+1, h-1); j++){
                    neigh.push(cells[i][j]);
                }
            }

            return neigh;
        };

        that.getNeigh = circular && getNeighCircular || getNeighNonCircular;

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
         * Allow to execute only one iteration of the automaton.
         */
        that.nextIteration = function(){
            executeAll(cell.execute);
            applyAll(cell.update);
            displayAll();
        };

        /**
         *  Make the animation, make one step each time it is called
         *  Stop when animating is set to false
         */
        var next = function(){
            setTimeout(function(){
                if(animating){
                    that.nextIteration();
                    next();
                }
            }, freqUpdate);
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
        initAll(cell.init);
        displayAll();

        return that;
    }

})(Automaton);