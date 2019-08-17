const TILE_SIZE = 64;
const MINIMAP_SCALE_FACTOR = 0.2;

let defgrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

/**
 * This class is used to update and render the map.
 */
class Map {
    /**
     * Create the current map-object.
     */
    constructor() {
        this.size = { x: 15, y: 11 };

        this.grid = [];
        for (let xIt = 0; xIt < this.size.x; xIt++) {
            this.grid[xIt] = [];
            for (let yIt = 0; yIt < this.size.y; yIt++) {
                this.grid[xIt][yIt] = defgrid[yIt][xIt];
            }
        }

        this.fieldsize = { x: this.size.x * TILE_SIZE, y: this.size.y * TILE_SIZE }
    } // constructor

    /**
     * Check the grid, if there's a wall at the according position.
     *
     * @returns {Number} The number stored in the grid, at that position
     *
     * @param {Object} pos_ - The tile to check
     */
    check(pos_) {
        if (pos_.x < 0 || pos_.x > this.fieldsize.x || pos_.y < 0 || pos_.y > this.fieldsize.y) {
            return (1);
        }

        let mapGridIndex = {
            x: Math.min(14, Math.floor(pos_.x / TILE_SIZE)),
            y: Math.min(10, Math.floor(pos_.y / TILE_SIZE))
        };

        return (this.grid[mapGridIndex.x][mapGridIndex.y]);
    } // check

    castRays() {
        var xIt = 0;

        // start first ray subtracting half of the FOV
        var rayAngle = $.clients.clients["player"].rotationAngle - (FOV_ANGLE / 2);

        NUM_RAYS = Math.floor($.window.size.x / 10);
        $.rays = [];

        // loop all columns casting the rays
        for (var i = 0; i < NUM_RAYS; i++) {
            var ray = new Ray(rayAngle);
            ray.cast(xIt);
            $.rays.push(ray);

            rayAngle += FOV_ANGLE / NUM_RAYS;

            xIt++;
        }
    } // castRays

    /**
     * Render the map using raycasting.
     */
    render() {
        // loop every ray in the array of rays
        for (var i = 0; i < NUM_RAYS; i++) {
            var ray = $.rays[i];
            var player = $.clients.clients["player"];
            var size = $.window.size;

            // get the perpendicular distance to the wall to fix fishbowl distortion
            var correctWallDistance = ray.distance * Math.cos(ray.rayAngle - player.rotationAngle);

            // calculate the distance to the projection plane
            var distanceProjectionPlane = (size.x / 2) / Math.tan(FOV_ANGLE / 2);

            // projected wall height
            var wallStripHeight = (TILE_SIZE / correctWallDistance) * distanceProjectionPlane;

            // compute the transparency based on the wall distance
            var alpha = (170 / correctWallDistance);

            // render a rectangle with the calculated wall height
            $.canvas.ctx.beginPath();
            var shade = 255 * alpha;
            $.canvas.ctx.fillStyle = ("rgb(" + shade + ", " + shade + ", " + shade + ")");
            $.canvas.ctx.rect(
                i * WALL_STRIP_WIDTH,
                (size.y / 2) - (wallStripHeight / 2),
                WALL_STRIP_WIDTH,
                wallStripHeight
            );
            $.canvas.ctx.fill();
        }
    } // render

    /**
     * Render the minimap on the canvas.
     */
    renderMinimap() {
        for (let xIt = 0; xIt < this.size.x; xIt++) {
            for (let yIt = 0; yIt < this.size.y; yIt++) {
                let tilePos = {
                    x: xIt * TILE_SIZE,
                    y: yIt * TILE_SIZE
                };
                let tileColor = (this.grid[xIt][yIt] == 1) ? ("#222") : ("#fff");
                $.canvas.ctx.beginPath();
                $.canvas.ctx.strokeStyle = "#222";
                $.canvas.ctx.fillStyle = tileColor;
                $.canvas.ctx.rect(
                    MINIMAP_SCALE_FACTOR * tilePos.x,
                    MINIMAP_SCALE_FACTOR * tilePos.y,
                    MINIMAP_SCALE_FACTOR * TILE_SIZE,
                    MINIMAP_SCALE_FACTOR * TILE_SIZE
                );
                $.canvas.ctx.stroke();
                $.canvas.ctx.fill();
            }
        }
    } // renderMinimap
} // Map