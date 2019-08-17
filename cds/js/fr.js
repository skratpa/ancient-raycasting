window.$ = {
    /**
     * Initialize the framework, by one creating/initializing the main objects, and two,
     * attachign them to the framework. Then start the game-loop.
    */
    init: function() {
        printf("Start framework.");

        // Create the main objects and attach them to the framework
        this.window = new Window();
        this.canvas = new Canvas("cnv");
        this.clients = new Clients();
        this.rays = [];
        this.keyboard = new Keyboard();
        this.mouse = new Mouse();
        this.map = new Map();
        this.game = new Game();

        // Attach a player to the client-array
        this.clients.add("player");

        printf("Connect to server...");
        if(this.clients.connect()) {
        	printf("Connected.");
        }

        // Start the game-loop
        this.game.start();
    } // init
} // $