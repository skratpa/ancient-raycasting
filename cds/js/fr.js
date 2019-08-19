/**
 * This class is used to keep track of rendering everything important about
 * the user.
 */
class User {
    /**
     * Create a new user-object.
     */
    constructor() {
        this.shoot = 0;
    } // constructor

    render() {
        var size = { x: 500, y: 500 };
        var pos = { x: (window.innerWidth / 2 - size.x / 2), y: window.innerHeight - size.y };

        $.canvas.ctx.drawImage(
            _sw.cache.images["self_arms"],
            0, 0,
            192, 192,
            pos.x, pos.y,
            size.x, size.y
        );
    } // render
} // User


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
        this.clients = new Clients();
        this.rays = [];
        this.keyboard = new Keyboard();
        this.mouse = new Mouse();
        this.map = new Map();
        this.game = new Game();
        this.self = new User();

        // Attach a player to the client-array
        this.clients.add("player");

        stdio.printf("Connect to server...");
        if (this.clients.connect()) {
            stdio.printf("Connected.");
        }

        // Start the game-loop
        this.game.start();
    } // init
} // $