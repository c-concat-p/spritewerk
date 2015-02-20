SW.Draw = Protos.extend({
    canvas: null,
    context: null,

    init: function() {
        this.canvas = SW.Canvas.getCanvas();
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = SW.Config.imageSmoothing;
    },

    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        return this;
    },

    fill: function(color) {
        this.context.save();
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.restore();

        return this;
    },

    render: function(entity) {
        // remember: context transforms are cumulative :)
        this.context.save();
        this.context.translate(entity.x, entity.y);

        if (entity.rotation !== 0) {
            this.context.translate(entity.rotationOffsetX, entity.rotationOffsetY);
            this.context.rotate((Math.PI / 180) * entity.rotation);
            this.context.translate(-entity.rotationOffsetX, -entity.rotationOffsetY);
        }

        if (entity.scaleX !== 1 || entity.scaleY !== 1) {
            this.context.translate(entity.scaleOffsetX, entity.scaleOffsetY);
            this.context.scale(entity.scaleX, entity.scaleY);
            this.context.translate(-entity.scaleOffsetX, -entity.scaleOffsetY);
        }

        this.context.globalAlpha = entity.opacity;
        this.context.globalCompositeOperation = entity.composite;

        switch(entity.displayType) {
            case 'rectangle':
                this._renderRectangle(entity);
            break;
            case 'sprite':
                this._renderSprite(entity);
            break;
        }

        this.context.restore();
    },

    /**
     * @method Draw.prototype._renderRectangle
     * @private
     */
    _renderRectangle: function(entity) {
        this.context.fillStyle = entity.fill;
        this.context.fillRect(0, 0, entity.width, entity.height);
    },

    /**
     * @method Draw.prototype._renderSprite
     * @private
     */
    _renderSprite: function(entity) {
        this.context.drawImage(
            entity.img,
            entity.srcX,
            entity.srcY,
            entity.srcWidth,
            entity.srcHeight,
            0, 0,
            entity.width,
            entity.height
        );
    }
});