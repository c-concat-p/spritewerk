class Xform {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
    }

    translate(x, y) {
        this.x += x;
        this.y += y;
    }

    scale(scaleX, scaleY) {
        this.scaleX *= scaleX;
        this.scaleY *= scaleY;
    }

    rotateAbout(deg, cx, cy) {
        let rad = deg * Math.PI / 180;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);

        let x = (this.x - cx) * cos - (this.y - cy) * sin;
        let y = (this.x - cx) * sin + (this.y - cy) * cos;

        this.x = x + cx;
        this.y = y + cy;
    }
}

/**
 * @class       Canvas
 * @description Handles rendering entities onto the canvas element. Merges context
 *              object with CanvasTransform instance in the constructor.
 * @author      Chris Peters
 * @requires    {@link CanvasTransform}
 *
 * @param {HTMLElement} canvas The active canvas element
 * @param {Camera}      camera The camera instance
 */
export default class Canvas {
    constructor(canvas, camera) {
        this._canvas = canvas;
        this._camera = camera;
        this._context = this._canvas.getContext('2d');
        this._imageSmoothingEnabled = true;

        this._context.imageSmoothingEnabled = this._imageSmoothingEnabled;
        this._context.mozImageSmoothingEnabled = this._imageSmoothingEnabled;
        this._context.webkitImageSmoothingEnabled = this._imageSmoothingEnabled;
        this._context.msImageSmoothingEnabled = this._imageSmoothingEnabled;
    }

    /**
     * Clears the entire canvas and optionally fills with a color
     *
     * @method Canvas#clear
     * @param  {String} [color] If passed, will fill the canvas with the color value
     */
    clear(color) {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        if (color) {
            this._context.save();
            this._context.fillStyle = color;
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
            this._context.restore();
        }
    }

    /**
     * Returns the context object
     *
     * @method Canvas#getContext
     * @return {Object} The 2D context object
     */
    getContext() {
        return this._context;
    }

    /**
     * Offsets canvas based on camera and calls an entity's render method passing the context.
     * Saves and restores context and beginning and end of operation.
     *
     * @method Canvas#render
     * @param  {Object} entity [description]
     */
    render(entity) {
        this._context.save();

        entity.render(this._context);

        this._context.restore();
    }

    /**
     * Set the context image smoothing
     *
     * @method Canvas#setImageSmoothing
     * @param  {Boolean} val The image smoothing value
     */
    setImageSmoothing(val) {
        this._imageSmoothingEnabled = val;
        this._context.imageSmoothingEnabled = this._imageSmoothingEnabled;
        this._context.mozImageSmoothingEnabled = this._imageSmoothingEnabled;
        this._context.webkitImageSmoothingEnabled = this._imageSmoothingEnabled;
        this._context.msImageSmoothingEnabled = this._imageSmoothingEnabled;

        return this;
    }

    update(entity) {
        let xform = new Xform();

        xform.translate(-this._camera.getX(), -this._camera.getY());

        entity.update(xform);
    }
}