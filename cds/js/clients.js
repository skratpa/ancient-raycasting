/**
 * A simple class representing a single client.
 */
class Entity {
    /**
     * Create a new client.
     */
    constructor(data_) {
        // The position of the Client
        this.pos = { x: 100, y: 100 };
        this.radius = 4;
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI / 2;
        this.moveSpeed = 4.0;
        this.rotationSpeed = 3 * (Math.PI / 180);
    } // constructor

    /**
     * Update this entity.
     *
     * @param {Number} dt_ - The time since the last frame
     */
    update(dt_) {
        var moveStep = this.walkDirection * this.moveSpeed;

        var newPlayerX = this.pos.x + Math.cos(this.rotationAngle) * moveStep;
        var newPlayerY = this.pos.y + Math.sin(this.rotationAngle) * moveStep;

        if ($.map.check({x: newPlayerX, y: newPlayerY}) == 0) {
            this.pos.x = newPlayerX;
            this.pos.y = newPlayerY;
        }
    } // update

    /**
     * Display this entity on the minimap.
     */
    renderMinimap() {
        $.canvas.ctx.beginPath();
        $.canvas.ctx.fillStyle = "blue";
        $.canvas.ctx.arc(
            MINIMAP_SCALE_FACTOR * this.pos.x,
            MINIMAP_SCALE_FACTOR * this.pos.y,
            MINIMAP_SCALE_FACTOR * this.radius,
            0,
            Math.PI * 2
        );
        $.canvas.ctx.fill();

        $.canvas.ctx.beginPath();
        $.canvas.ctx.strokeStyle = "blue";
        $.canvas.ctx.moveTo(
            MINIMAP_SCALE_FACTOR * this.pos.x,
            MINIMAP_SCALE_FACTOR * this.pos.y
        );
        $.canvas.ctx.lineTo(
            MINIMAP_SCALE_FACTOR * (this.pos.x + Math.cos(this.rotationAngle) * 30),
            MINIMAP_SCALE_FACTOR * (this.pos.y + Math.sin(this.rotationAngle) * 30)
        );
        $.canvas.ctx.stroke();
    } // renderMinimap
} // Entity

/**
 * This class is used to keep track of all clients in the match.
 */
class Clients {
    /**
     * Initialize the different clients.
     */
    constructor() {
        // The socket-object
        this.io = null;

        // The id of this client
        this.clientId = null;
        // The id of the match the user is currently in
        this.matchId = null;

        // An array containing all clients in the match
        this.clients = [];
    } // init

    /**
     * Setup the socket and connect to the server.
     */
    connect() {
        this.io = io();

        if (this.io != undefined) {
            return (true);
        }

        return (false);
    } // connect

    /**
     * Close the connection to the server.
     */
    disconnect() {

    } // disconnect

    /**
     * Add a new client to the clients-array.
     */
    add(clientId_) {
        let newClient = new Entity();

        this.clients[clientId_] = newClient;
    } // add

    /**
     * Remove a client from the clients-array.
     *
     * @param {String} clientId_ - The id of the client to remove
     */
    rmv(clientId_) {

    } // rmv

    /**
     * Update the entities.
     *
     * @param {Number} dt_ - The time since the last frame
     */
    update(dt_) {
        for (let cliIt in this.clients) {
            this.clients[cliIt].update(dt_);
        }
    } // update

    /**
     * Render all entites on the minimap.
     */
    renderMinimap() {
        for (let cliIt in this.clients) {
            this.clients[cliIt].renderMinimap();
        }
    } // renderMinimap
} // Clients