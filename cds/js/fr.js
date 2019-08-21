/**
 * This framework-object is used to keep track of all important parts of the script.
*/
const $ = {
    /**
     * Initialize the framework, by one creating/initializing the main objects, and two,
     * attachign them to the framework. Then start the game-loop.
     */
    init: function() {
        stdio.printf("Start framework.");

        // Create the main objects and attach them to the framework
        this.window = new Window();
        this.canvas = new Canvas("cnv");
        this.player = new Player();
        this.rays = [];
        this.keyboard = new Keyboard();
        this.map = new Map();
        this.game = new Game();

        // Start the game-loop
        this.game.start();
    } // init
} // $



/**
 * Get a current timestamp, and use either performance or Date, depending on the available option.
 *
 * @returns {Number} The current time
 */
function timestamp() {
    return ((window.performance && window.performance.now) ? (window.performance.now()) : (new Date().getTime()));
} // timestamp