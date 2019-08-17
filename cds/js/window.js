/**
 * The main window-manager-class. This static instance is used for managing the display-unit and resizing the window.
 */
class Window {
    /**
     * Initialize this window-manager-class and prepare some window-events, like resizing.
     */
    constructor() {
        /**
         * This is the regular window-size, on which the scaling-model is
         * based on.
         */
        this.stdViewport = {
            x: 640, // The width of the screen
            y: 360, // The height of the screen
            d: 734 // The diagonale width of the screen
        };

        /**
         * The current size of the window.
         */
        this.size = {
            x: this.stdViewport.x,
            y: this.stdViewport.y
        };

        // When the user resizes the window, the display has to adapt to the new size
        window.addEventListener("resize", () => {
            this.resize();
        });

        // Resize the display for the first time
        this.resize();
    } // constructor

    /**
     * Either get an element by using the element-id, or get a list of elements by using a point and the classname following it.
     *
     * @returns {Object||Object[]} An HTML-element, a list of HTML-elements or undefined if nothing has been found
     *
     * @param {String} selector_ - The element-id for getting a single HTML-element, a point+classname for getting a list of
     *                                 HTML-elements
     */
    get(selector_) {
        if (!selector_) return (null);

        return ((selector_[0] == ".") ? (document.getElementsByClassName(selector_.substr(1))) : (document.getElementById(selector_)));
    } // get

    /**
     * Either get a CSS-attribute of a HTML-element or set http://127.0.0.1:4242/a new value for this CSS-attribute.
     *
     * @returns {String} The current value of this CSS-attribute of the HTML-element, after this function has finished
     *
     * @param {String|Object} selector_ - Either an element-id of a HTML-element or the element-object
     * @param {String} attr_ - The CSS-attribute to set or get
     * @param {String} [value_] - The new value for the CSS-attribute of the element
     */
    css(selector_, attr_, value_) {
        if (!selector_ || !attr_) return (null);

        // Get the element to modify
        let element = (typeof(selector_) === "object") ? (selector_) : (this.get(selector_));

        if (value_) {
            element.style[attr_] = value_;
        }

        // Return the value of the CSS-attribute
        return (element.style[attr_]);
    } // css

    /**
     * Clear the inner content of a HTML-element.
     *
     * @param {String|Object} selector_ - Either an element-id of a HTML-element or the element-object
     */
    empty(selector_) {
        if (!selector_) return (null);

        // Get the element to change
        let element = (typeof(selector_) === "object") ? (selector_) : (this.get(selector_));

        // Set the content of the element
        element.innerHTML = "";
    } // html

    /**
     * Set the inner HTML-content of an element.
     *
     * @param {String|Object} selector_ - Either an element-id of a HTML-element or the element-object
     * @param {String} content_ - The new inner HTML-text to set
     */
    html(selector_, content_) {
        if (!selector_) return (null);

        // Get the element to modify
        let element = (typeof(selector_) === "object") ? (selector_) : (this.get(selector_));

        if (!content_) return (element.innerHTML);

        // Set the content of the element
        element.innerHTML = content_;
    } // html

    /**
     * Attach a string to the end of the inner HTML-content of an element.
     *
     * @param {String|Object} selector_ - Either an element-id of a HTML-element or the element-object
     * @param {String} content_ - The string to attach to the content
     */
    attach(selector_, content_) {
        if (!selector_ || !content_) return (null);

        // Get the element to modify
        let element = (typeof(selector_) === "object") ? (selector_) : (this.get(selector_));

        // Set the content of the element
        element.innerHTML += content_;
    } // attach

    /**
     * Remove an HTML-element.
     *
     * @param {String|Object} selector_ - Either an element-id of a HTML-element or the element-object
     */
    remove(selector_) {
        if (!selector_) return (null);

        // Get the element to modify
        let element = (typeof(selector_) === "object") ? (selector_) : (this.get(selector_));

        // Remove the element
        element.parentNode.removeChild(element);
    } // remove

    /**
     * Attach an event to an element.
     *
     * @param {String|Object} selector_ - Either an element-id of a HTML-element or the element-object
     * @param {String} evt_ - The nme of the event
     * @param {Callback} callb_ - The callback-function
     */
    event(selector_, evt_, callb_) {
        if (!selector_) return (null);

        // Get the element to modify
        let element = (typeof(selector_) === "object") ? (selector_) : (this.get(selector_));

        // Attach the event
        element.addEventListener(evt_, callb_);
    } // event

    /**
     * Set and get a data-attribute off an element.
     *
     * @param {String|Object} selector_ - Either an element-id of a HTML-element or the element-object
     * @param {String} tag_ - The attribute-tag to modify/get
     * @param 
     */
    data(selector_, tag_, value_) {
        if (!selector_) return (null);

        // Get the element to modify
        let element = (typeof(selector_) === "object") ? (selector_) : (this.get(selector_));

        if (value_ != undefined) {
            element.dataset[tag_] = value_;
        }

        return (element.dataset[tag_]);
    } // data

    /**
     * Resize the display unit to fill out the screen. This function is called, when the window is resized.
     */
    resize() {
        // The new size of the display-container
        let displaySize = {
            x: window.innerWidth,
            y: window.innerHeight
        };

        // Update the size of the display-container
        this.size = displaySize;

        // If the game has already started
        if ($.canvas != null) {
            // Adjust the size of the rendering-canvas
            $.canvas.resize(displaySize);
        }

        // Adjust the css-size of the display-container
        this.css("container", "width", this.size.x + "px");
        this.css("container", "height", this.size.y + "px");

        // Calculate the diagonale size of the window
        let a = Math.sqrt((displaySize.x * displaySize.x) + (displaySize.y * displaySize.y));

        // Calculate the scaling-factor depending on the relative diagonale-size of the window,
        // relative to the standard diagonal window-size
        let scaleFactor =
            Math.sqrt(Math.pow(this.size.x, 2) + Math.pow(this.size.y, 2)) / this.stdViewport.d;

        // Limit the scaling-factor
        scaleFactor = Math.min(scaleFactor, 2);

        // Adjust the font-size depending on the scalingFactor
        this.css(document.body, "font-size", Math.round(scaleFactor * 100) + "%");
    } // resize

    /**
     * Check if fullscreen-mode is currently enabled.
     *
     * @returns {Boolean} True, if fullscreen is on, else false
     */
    checkFullscreen() {
        return (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);
    } // checkFullscreen

    /**
     * Start the fullscreen-mode.
     */
    fullscreen() {
        var docElm = this.get("container");
        if (!this.checkFullscreen()) {
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    } // fullscreen

    /**
     * Change the current windowframe.
     *
     * @param {String} The id of the current windowframe
     */
    changeWf(wfId_) {
        let wfList = $.window.get(".wf");

        for (let wfIt = 0; wfIt < wfList.length; wfIt++) {
            $.window.css(wfList[wfIt], "display", "none");
        }

        $.window.css(wfId_, "display", "block");
    } // changeWf
} // Window

/**
 * A class used to create a canvas-handler, which is then used for rendering sprites and effects on the screen.
 */
class Canvas {
    /**
     * Initialize the canvas-handler.
     */
    constructor(eleId_) {
        this.ele = document.getElementById(eleId_);
        this.ctx = this.ele.getContext("2d");

        this.size = {
            x: $.window.size.x,
            y: $.window.size.y
        };

        // Initially adjust the size of the canvas to fit the screen
        this.resize($.window.size);
    } // constructor

    /**
     * Adjust the size of the canvas to adapt to the windowsize.
     *
     * @param {Number} si_ - The size of the screen
     */
    resize(si_) {
        // Set the size of the handler
        this.size = {
            x: si_.x,
            y: si_.y
        };

        // Set the size of the canvas
        this.ele.width = this.size.x;
        this.ele.height = this.size.y;

        // Set the css-attributes for the size of the canvas
        $.window.css(this.ele, "width", this.size.x + "px");
        $.window.css(this.ele, "height", this.size.y + "px");

        // Disable aliasing
        this.ctx.imageSmoothingEnabled = false;
    } // adjustSize

    /**
     * Clear the canvas.
     */
    clear() {
        // Clear the whole canvas
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    } // clear

    /**
     * Render an image.
     *
     * @param {String} spr_ - The name of the sprite to render
     * @param {Number} x_ - The x-position to render the sprite at
     * @param {Number} y_ - The y-position to render the sprite at
     * @param {Number} fr_ - The frame of the sprite to render
     * @param {Object} fl_ - Additional flags
     */
    render(spr_, x_, y_, fr_ = 0, fl_) {
        let sprite = sSprites[spr_];
        let frame = sprite.frames[fr_] || sprite.frames[0];
        let pos = $.camera.get({ x: x_, y: y_ });
        let size = $.camera.conv({ x: sprite.size.x, y: sprite.size.y });

        this.ctx.drawImage(
            frame,
            0, 0,
            (sprite.size.x * BASESIZE), (sprite.size.y * BASESIZE),
            Math.floor(pos.x - (size.x / 2)),
            Math.floor(pos.y - (size.y / 2)),
            Math.floor(size.x),
            Math.floor(size.y)
        );
    } // render
} // Canvas