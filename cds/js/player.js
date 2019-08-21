/**
 * A simple class representing the player.
 */
class Player {
    /**
     * Create a new Player.
     */
    constructor() {
        this.pos = { x: 100, y: 100 };
        this.radius = 4;
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI / 2;
        this.moveSpeed = 4.0;
        this.rotationSpeed = 3 * (Math.PI / 180);
    } // constructor

    /**
     * Update this player.
     *
     * @param {Number} dt_ - The time since the last frame
     */
    update(dt_) {
        this.rotationAngle += this.turnDirection * this.rotationSpeed;

        var moveStep = this.walkDirection * this.moveSpeed;

        var newPlayerX = this.pos.x + Math.cos(this.rotationAngle) * moveStep;
        var newPlayerY = this.pos.y + Math.sin(this.rotationAngle) * moveStep;

        if ($.map.check({x: newPlayerX, y: newPlayerY}) == 0) {
            this.pos.x = newPlayerX;
            this.pos.y = newPlayerY;
        }
    } // update

    /**
     * Display this player on the minimap.
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
} // Player