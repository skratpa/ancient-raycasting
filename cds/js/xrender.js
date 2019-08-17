var FOV_ANGLE = 60 * (Math.PI / 180);
var NUM_RAYS = 0;
const WALL_STRIP_WIDTH = 10; 

/**
 * Normalize an angle.
 *
 * @returns {Number} The normalized angle
 *
 * @param {Number} angle_ - The angle to normalize
 */
function normalizeAngle(angle_) {
    angle_ = angle_ % (2 * Math.PI);
    return (angle_ < 0) ? ((2 * Math.PI) + angle_) : (angle_);
} // normalizeAngle



/**
 * Get the distance between two points.
 */
function distance(x1, y1, x2, y2) {
    return (Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
} // distance

/**
 * A class used to manage Raycasting.
 */
class Ray {
    /**
     * Create the Raycasting-manager.
     */
    constructor(rayAngle_) {
        this.rayAngle = normalizeAngle(rayAngle_);
        this.wallHit = { x: 0, y: 0 };
        this.distance = 0;
        this.wasHitVertical = false;

        this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
        this.isRayFacingUp = !this.isRayFacingDown;

        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
    } // constructor

    cast(columnId) {
        var intercept = { x: 0, y: 0 };
        var step = { x: 0, y: 0 };

        let pos = $.clients.clients["player"].pos;

        var size = $.map.fieldsize;

        ///////////////////////////////////////////
        // HORIZONTAL RAY-GRID INTERSECTION CODE
        ///////////////////////////////////////////
        var foundHorzWallHit = false;
        var horzWallHit = { x: 0, y: 0 };

        // Find the y-coordinate of the closest horizontal grid intersenction
        intercept.y = Math.floor(pos.y / TILE_SIZE) * TILE_SIZE;
        intercept.y += this.isRayFacingDown ? TILE_SIZE : 0;

        // Find the x-coordinate of the closest horizontal grid intersection
        intercept.x = pos.x + (intercept.y - pos.y) / Math.tan(this.rayAngle);

        // Calculate the increment xstep and ystep
        step.y = TILE_SIZE;
        step.y *= this.isRayFacingUp ? -1 : 1;

        step.x = TILE_SIZE / Math.tan(this.rayAngle);
        step.x *= (this.isRayFacingLeft && step.x > 0) ? -1 : 1;
        step.x *= (this.isRayFacingRight && step.x < 0) ? -1 : 1;

        let nextHorzTouch = { x: intercept.x, y: intercept.y };

        if (this.isRayFacingUp) {
            nextHorzTouch.y--;
        }

        // Increment xstep and ystep until we find a wall
        while (nextHorzTouch.x >= 0 && nextHorzTouch.x <= size.x &&
            nextHorzTouch.y >= 0 && nextHorzTouch.y <= size.y) {
            if ($.map.check({ x: nextHorzTouch.x, y: nextHorzTouch.y }) != 0) {
                foundHorzWallHit = true;
                horzWallHit.x = nextHorzTouch.x;
                horzWallHit.y = nextHorzTouch.y;
                break;
            } else {
                nextHorzTouch.x += step.x;
                nextHorzTouch.y += step.y;
            }
        }

        ///////////////////////////////////////////
        // VERTICAL RAY-GRID INTERSECTION CODE
        ///////////////////////////////////////////
        var foundVertWallHit = false;
        var vertWallHit = { x: 0, y: 0 };

        // Find the x-coordinate of the closest vertical grid intersenction
        intercept.x = Math.floor(pos.x / TILE_SIZE) * TILE_SIZE;
        intercept.x += this.isRayFacingRight ? TILE_SIZE : 0;

        // Find the y-coordinate of the closest vertical grid intersection
        intercept.y = pos.y + (intercept.x - pos.x) * Math.tan(this.rayAngle);

        // Calculate the increment xstep and ystep
        step.x = TILE_SIZE;
        step.x *= this.isRayFacingLeft ? -1 : 1;

        step.y = TILE_SIZE * Math.tan(this.rayAngle);
        step.y *= (this.isRayFacingUp && step.y > 0) ? -1 : 1;
        step.y *= (this.isRayFacingDown && step.y < 0) ? -1 : 1;

        var nextVertTouch = { x: intercept.x, y: intercept.y };

        if (this.isRayFacingLeft) {
            nextVertTouch.x--;
        }

        // Increment xstep and ystep until we find a wall
        while (nextVertTouch.x >= 0 && nextVertTouch.x <= size.x &&
            nextVertTouch.y >= 0 && nextVertTouch.y <= size.y) {
            if ($.map.check({ x: nextVertTouch.x, y: nextVertTouch.y }) != 0) {
                foundVertWallHit = true;
                vertWallHit.x = nextVertTouch.x;
                vertWallHit.y = nextVertTouch.y;
                break;
            } else {
                nextVertTouch.x += step.x;
                nextVertTouch.y += step.y;
            }
        }

        // Calculate both horizontal and vertical distances and choose the smallest value
        var horzHitDistance = (foundHorzWallHit) ?
            distance(pos.x, pos.y, horzWallHit.x, horzWallHit.y) :
            Number.MAX_VALUE;
        var vertHitDistance = (foundVertWallHit) ?
            distance(pos.x, pos.y, vertWallHit.x, vertWallHit.y) :
            Number.MAX_VALUE;

        // only store the smallest of the distances
        this.wallHit.x = (horzHitDistance < vertHitDistance) ? horzWallHit.x : vertWallHit.x;
        this.wallHit.y = (horzHitDistance < vertHitDistance) ? horzWallHit.y : vertWallHit.y;
        this.distance = (horzHitDistance < vertHitDistance) ? horzHitDistance : vertHitDistance;
        this.wasHitVertical = (vertHitDistance < horzHitDistance);
    } // cast

    /**
     * Render the rays on the minimap.
     */
    renderMinimap() {
        $.canvas.ctx.beginPath();
        $.canvas.ctx.strokeStyle = "red";
        $.canvas.ctx.moveTo(
            MINIMAP_SCALE_FACTOR * $.clients.clients["player"].pos.x,
            MINIMAP_SCALE_FACTOR * $.clients.clients["player"].pos.y
        );
        $.canvas.ctx.lineTo(
            MINIMAP_SCALE_FACTOR * this.wallHit.x,
            MINIMAP_SCALE_FACTOR * this.wallHit.y
        );
        $.canvas.ctx.stroke();
    } // renderMinimap
} // Ray