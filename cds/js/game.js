/**
 * This class is used for managing the main GameLoop.
 */
class Game {
    /**
     * Initialize the game-object.
     */
    constructor() {
        // Is the game currently running
        this.state = "stop";

        this.framerate = 60;
        this.frameduration = (1000 / this.framerate);
        this.recallTimer = 0;
        this.recallDelta = 0;
        this.clockTimer = timestamp();
        this.framecount = [];
        this.framedelta = 0;
        this.lastframedelta = 0;
        this.lastframetime = timestamp();
    } // constructor

    /**
     * Start the inner GameLoop of this GameCore.
     */
    start() {
        // Skip the starting process, if the game is already running
        if (this.state == "running") return;

        // Mark loop as active
        this.state = "running";

        // Reset the values
        this.framerate = 60;
        this.frameduration = (1000 / this.framerate);
        this.recallTimer = 0;
        this.recallDelta = 0;
        this.clockTimer = timestamp();
        this.framecount = [];
        this.framedelta = 0;
        this.lastframedelta = 0;
        this.lastframetime = timestamp();
        this.numUpdateSteps = 0;

        // Start the main loop
        this.run();
    } // start

    /**
     * Stop the inner GameLoop of this GameCore.
     */
    finish() {
        // Mark the loop as stopped
        this.state = "stop";
    } // finish

    /**
     */
    panic() {
        // Recall the 
        this.recallDelta = 0;
    } // panic

    /**
     * Run the recursive gameloop.
     */
    run() {
        if (this.state != "running") {
            return;
        }

        // Get the current time of this frame
        let frametime = timestamp();

        // if (frametime < this.recallTimer + this.frameduration) {
        //     requestAnimationFrame(() => {
        //         this.run();
        //     });
        //     return;
        // }

        this.recallDelta += frametime - this.recallTimer;
        this.recallTimer = frametime;

        this.numUpdateSteps = 0;

        while (this.recallDelta > this.frameduration && this.state == "running") {
            this.update(this.frameduration);

            this.recallDelta -= this.frameduration;

            if (++this.numUpdateSteps >= 240) {
                this.panic();
                break;
            }
        }

        // Render the game, and use interpolation
        this.render(this.recallDelta / this.frameduration);

        // Continue the CoreLoop recursivly, until the game is stopped
        requestAnimationFrame(() => {
            this.run();
        });
    } // run

    /**
     * Update the game and all of the active entities and the active objects.
     *
     * @param {Number} deltime_ - The time since the last frame
     */
    update(deltime_) {
        $.keyboard.processInput();

        $.player.update();

        $.map.castRays();
    } // update

    /**
     * Render the game on the screen and use interpolation.
     *
     * @param {Number} interpol_ - The interpolation-factor
     */
    render(interpol_) {
        $.canvas.clear();

        $.canvas.ctx.beginPath();
        $.canvas.ctx.rect(0, $.window.size.y / 2, $.window.size.x, $.window.size.y / 2);
        $.canvas.ctx.fillStyle = "#c9c9c9";
        $.canvas.ctx.fill();
        $.canvas.ctx.closePath();

        $.map.render();

        // Render the basic minimap
        $.map.renderMinimap();

        // Render the player on the minimap
        $.player.renderMinimap();

        // Render the rays on the minimap
        for(let rIt = 0; rIt < $.rays.length;rIt++) {
            $.rays[rIt].renderMinimap();
        }
    } // render
} // _game