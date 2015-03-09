SW.Game.Layer = (function() {
    'use strict';

    /**
     * holds display configurations and entities 
     *
     * @class SW.Game.Layer
     * @extends SW.Common.Collection
     * @belongsto SW
     */
    var Layer = function() {
        SW.Common.Collection.call(this);

        /**
         * if scrolling employed, describes the factor
         * this property is not used on the layer but is passed to its entities
         *
         * @member {Float} SW.Game.Scene.prototype._scrollFactor
         * @default 1
         * @private
         */
        this._scrollFactor = 1;
    };

    Layer.prototype = SW.Common.Collection.prototype;

    return Layer;
}());