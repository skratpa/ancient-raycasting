/**
 * A class used to handle keyboard-input.
 */
class Keyboard {
    /**
     * Create the keyboard-input-manager.
     */
    constructor() {
        // An array containing all active keys
        this.activeKeys = {};

        // Attach all necessary events
        this.attachEvents();
    } // constructor

    /**
     * Attach all necessary events to the document.
     */
    attachEvents() {
        // If a key is pressed, push it into the active-array
        document.addEventListener("keydown", (e) => {
            // e.preventDefault();
            this.activeKeys[e.keyCode] = true;
        });

        // If a key is released, remove it from the active-array
        document.addEventListener("keyup", (e) => {
            e.preventDefault();
            delete(this.activeKeys[e.keyCode]);
        });
    } // attachEvents

    /**
     * Check, if a key is currently pressed.
     *
     * @returns {Boolean} Is the key currently pressed
     *
     * @param {Number} key_ - The key-index
     */
    check(key_) {
        // Return, if the key is actively pushed
        return (!!this.activeKeys[key_]);
    } // check

    /**
     * Process keyboard-inputs.
     */
    processInput() {
        // Walk forwards
        if (this.check(87)) {
            $.clients.clients["player"].walkDirection = +1;
        }
        // Walk backwards
        else if (this.check(83)) {
            $.clients.clients["player"].walkDirection = -1;
        }
        // Stop walking
        else {
            $.clients.clients["player"].walkDirection = 0;
        }
    } // processInput
} // Keyboard

/**
 * A class used to handle mouse-input.
 */
class Mouse {
    /**
     * Create a new mouse-input-manager.
     */
    constructor() {
        // The current position of the mouse
        this.pos = { x: 0, y: 0 };
        this.del = { x: 0, y: 0 };

        this.sensitivity = 8;

        // Attach events
        this.attachEvents();
    } // constructor

    /**
     * Attach all necessary events to the document.
     */
    attachEvents() {
        document.addEventListener("mousemove", (e) => {
        	e.preventDefault();
            let newPos = { x: e.clientX, y: e.clientY };
            this.del = { x: (this.pos.x - newPos.x), y: (this.pos.y - newPos.y) };
            this.pos = newPos;
        });
    } // attachEvents

    /**
     * Process mouse-inputs.
     */
    processInput() {
        if (this.del.x != 0) {
            console.log(this.del.x);
            $.clients.clients["player"].rotationAngle -= (this.del.x / $.window.size.x) * this.sensitivity;
        }

        this.del = { x: 0, y: 0 };
    } // processInput
} // Mouse