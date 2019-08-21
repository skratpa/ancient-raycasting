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
        if (this.check(38)) {
            $.player.walkDirection = +1;
        }
        // Walk backwards
        else if (this.check(40)) {
            $.player.walkDirection = -1;
        }
        // Stop walking
        else {
            $.player.walkDirection = 0;
        }

        // Turn left
        if(this.check(37)) {
            $.player.turnDirection = -1;
        }
        // Turn right
        else if(this.check(39)) {
            $.player.turnDirection = 1;
        }
        else {
            $.player.turnDirection = 0;
        }
    } // processInput
} // Keyboard