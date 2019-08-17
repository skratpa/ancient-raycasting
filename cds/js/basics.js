/**
 * Get a current timestamp, and use either performance or Date, depending on the available option.
 *
 * @returns {Number} The current time
 */
function timestamp() {
    return ((window.performance && window.performance.now) ? (window.performance.now()) : (new Date().getTime()));
} // timestamp

/**
 * Print an error in the console.
 *
 * @param {String} error_ - The error-object
 * @param {String} [message_] - The message which should also be printed out
 */
function perror(error_, message_) {
    // Print the error-message in the console
    console.log(error_, (message_) ? (message_) : (""));
} // perror

/**
 * Create a new cookie.
 *
 * @param {String} cName_ - The name of the cookie
 * @param {String} cValue_ - The value of the cookie as a string
 */
function setCookie(cName_, cValue_) {
    document.cookie = cName_ + "=" + cValue_ + ";path=/";
} // setCookie

/**
 * Get a cookie by the name.
 *
 * @returns {String} The value of the specific cookie or an empty string, if the cookie doesn't exist
 *
 * @param {String} cName_ - The name of the cookie to get
 */
function getCookie(cName_) {
    let name = cName_ + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return (c.substring(name.length, c.length));
        }
    }
    return ("");
} // getCookie

/**
 * A simple 2d-Vector-Class to enable movement.
 */
class _vec {
    /**
     * A higher-level function used to apply a defined funciton on both values.
     *
     * @returns {Object} A new 2d-vector-object
     *
     * @param {Function} fnc_ - The function to apply on both values
     * @param {Object} vector_ - The vector to apply the function on
    */
    static apply(fnc_, vector_) {
        return({
            x: fnc_(vector_.x),
            y: fnc_(vector_.y)
        });
    } // apply

    /**
     * Add two vectors together.
     *
     * @returns {Object} A new 2d-vector-object
     *
     * @param {Object} vector1_ - The first vector
     * @param {Object} vector2_ - The second vector
     */
    static add(vector1_, vector2_) {
        return ({
            x: (vector1_.x + vector2_.x),
            y: (vector1_.y + vector2_.y)
        });
    } // mult

    /**
     * Subtract two vectors.
     *
     * @returns {Object} A new 2d-vector-object
     *
     * @param {Object} vector1_ - The first vector
     * @param {Object} vector2_ - The second vector
     */
    static sub(vector1_, vector2_) {
        return ({
            x: (vector1_.x - vector2_.x),
            y: (vector1_.y - vector2_.y)
        });
    } // mult

    /**
     * Multiply the vector by a scalar.
     *
     * @returns {Object} A new 2d-vector-object
     *
     * @param {Object} vector_ - The vector to scale
     * @param {Object} scalar_ - The scaling factor
     */
    static mult(vector_, scalar_) {
        return ({
            x: (vector_.x * scalar_),
            y: (vector_.y * scalar_)
        });
    } // mult

    /**
     * Divide the vector by a scalar.
     *
     * @returns {Object} A new 2d-vector-object
     *
     * @param {Object} vector_ - The vector to scale
     * @param {Object} scalar_ - The scaling factor
     */
    static div(vector_, scalar_) {
        return ({
            x: (vector_.x / scalar_),
            y: (vector_.y / scalar_)
        });
    } // mult

    /**
     * Calculates the magnitude (length) of the vector.
     *
     * @returns {Number} The magnitude/length of the vector
     *
     * @param {Object} vector_ - The vector to scale
     */
    static mag(vector_) {
        return (Math.sqrt(vector_.x * vector_.x + vector_.y * vector_.y));
    } // mag

    /**
     * Calculates the squared magnitude of a vector.
     * Faster if the real length is not required in the case of comparing vectors, etc.
     *
     * @returns {Number} The magnitude/length of the vector
     *
     * @param {Object} vector_ - The vector to get the length from
     */
    static magSq(vector_) {
        return (vector_.x * vector_.x + vector_.y * vector_.y);
    } // magSq

    /**
     * Limit a vector by a specific max value.
     *
     * @returns {Object} A new 2d-vector-object
     *
     * @param {Object} vector_ - The vector to limit
     * @param {Number} limit_ - The max value
     */
    static limit(vector_, limit_) {
        var mSq = _vec.magSq(vector_);
        if (mSq > limit_ * limit_) {
            return (_vec.mult(_vec.div(vector_, Math.sqrt(mSq)), limit_));
        }
    } // limit
} // _vec