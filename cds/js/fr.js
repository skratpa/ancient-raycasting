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
        this.player = new Entity();
        this.rays = [];
        this.keyboard = new Keyboard();
        this.map = new Map();
        this.game = new Game();

        // Start the game-loop
        this.game.start();
    } // init
} // $