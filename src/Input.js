import keycodes from './lib/keycodes';

/**
 * @class       Input
 * @description A module for handling keyboard, mouse, and touch events on the canvas
 * @author      Chris Peters
 *
 * @param {HTMLEntity} canvas                   The canvas element to interact with
 * @param {Object}     [opts]
 * @param {Boolean}    [opts.canvasFit]         Set to true if using css to fit the canvas in the viewport
 * @param {Boolean}    [opts.listenForMouse]    Whether or not to listen for mouse events
 * @param {Boolean}    [opts.listenForTouch]    Whether or not to listen for touch events
 * @param {Boolean}    [opts.listenForKeyboard] Whether or not to listen for keyboard events
 */
export default class Input {
    constructor(canvas, opts = {}) {
        // options
        this._canvas = canvas;
        this._canvasFit = opts.canvasFit || true;
        this._listenForMouse = opts.listenForMouse || true;
        this._listenForTouch = opts.listenForTouch || false;
        this._listenForKeyboard = opts.listenForKeyboard || true;

        this._uiEvents = {
            DBL_CLICK: 'dblclick',
            DBL_TAP: 'dbltap',

            DRAG: 'drag',
            DRAG_END: 'dragend',
            DRAG_START: 'dragstart',

            CLICK: 'click',
            TAP: 'tap',

            MOUSE_DOWN: 'mousedown',
            MOUSE_UP: 'mouseup',
            TOUCH_START: 'touchstart',
            TOUCH_END: 'touchend',

            MOUSE_MOVE: 'mousemove',
            TOUCH_MOVE: 'touchmove',

            KEY_UP: 'keyup',
            KEY_DOWN: 'keydown'
        };

        // listeners values are arrays of objects containing handlers and (optional) targets
        // eg: this._listeners.keyup = [{
        //         handler: function () {...},
        //         target: { name: 'foo', x: 32, y: 64, ...}
        //     }];
        this._listeners = {};

        for (let key in this._uiEvents) {
            this._listeners[this._uiEvents[key]] = [];
        }

        this._keycodes = keycodes;
        this._canDrag = false;
        this._isDragging = false;
        this._keysDown = {};
        this._userHitTestMethod = null;
        this._queuedEvents = [];

        if (this._listenForKeyboard) {
            this._addKeyboardListeners();
        }

        if (this._listenForMouse) {
            this._addMouseListeners();
        }

        if (this._listenForTouch) {
            this._addTouchListeners();
        }

        this._onTick = this._onTick.bind(this);
        document.addEventListener('tick', this._onTick, false);
    }

    /**
     * Adds keyboard listeners
     *
     * @method Input#_addKeyboardListeners
     * @private
     */
    _addKeyboardListeners() {
        let events = ['keyup', 'keydown'];

        for (let event of events) {
            this._canvas.addEventListener(event, this._handleKeyboard.bind(this), false);
        }
    }

    /**
     * Adds mouse listeners
     *
     * @method Input#_addMouseListeners
     * @private
     */
    _addMouseListeners() {
        let events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove'];

        for (let event of events) {
            this._canvas.addEventListener(event, this._handleMouseAndTouch.bind(this), false);
        }
    }

    /**
     * Adds touch listeners
     *
     * @method Input#_addTouchListeners
     * @private
     */
    _addTouchListeners() {
        let events = ['tap', 'dbltap', 'touchstart', 'touchend', 'touchmove'];

        for (let event of events) {
            this._canvas.addEventListener(event, this._handleMouseAndTouch.bind(this), false);
        }
    }

    /**
     * get the scale ratio of the canvas based on with/heght attrs and css width/height
     *
     * @method Input#_getScaleFactor
     * @return {Float}
     */
    _getScaleFactor() {
        let factor = 1;
        let canvasWidth;

        if (this._canvas.style.width) {
            canvasWidth = parseInt(this._canvas.style.width, 10);
            factor = canvasWidth / this._canvas.width;
        }

        return 100 / factor / 100;
    }

    /**
     * Checks if point is inside rectangle
     *
     * @method Input#_hitTest
     * @param  {Integer} x          [description]
     * @param  {Integer} y          [description]
     * @param  {Object} boundingBox [description]
     * @return {Boolean}
     */
    _hitTest(x, y, boundingBox) {
        return x >= boundingBox.minX && x <= boundingBox.maxX &&
            y >= boundingBox.minY && y <= boundingBox.maxY;
    }

    /**
     * Handler for DOM events. Creates custom event object with helpful properties
     *
     * @method Input#_handleKeyboard
     * @param {object} inputEvent the DOM input event object
     * @private
     */
    _handleKeyboard(inputEvent) {
        inputEvent.preventDefault();

        let keyName = this._keycodes[inputEvent.keyCode];
        let event = {
            domEvent: inputEvent,
            type: inputEvent.type,
            keyCode: inputEvent.keyCode,
            keyName: typeof keyName === 'object' && keyName.length ?
                keyName[0] :
                keyName
        };

        switch (event.type) {
            case this._uiEvents.KEY_DOWN:
                this._keysDown[keyName] = inputEvent.keyCode;
                break;
            case this._uiEvents.KEY_UP:
                delete this._keysDown[keyName];
                break;
        }

        event.keysDown = this.getKeysDown();

        this._queuedEvents.push(event);
    }

    /**
     * Handler for DOM events. Creates custom event object with helpful properties
     * Creates event objects with x/y coordinates based on scaling and absX/absY for
     * absolute x/y regardless of scale offset
     * Only uses first touch event, thus not currently supporting multi-touch
     *
     * @method Input#
     * @param {object} inputEvent The DOM input event object
     */
    _handleMouseAndTouch(inputEvent) {
        inputEvent.preventDefault();

        let scaleFactor = this._canvasFit ? this._getScaleFactor() : 1;
        let event = {
            domEvent: inputEvent,
            type: inputEvent.type
        };

        this._queuedEvents.push(event);

        if (inputEvent.hasOwnProperty('touches')) {
            event.absX = inputEvent.touches[0].pageX - this._canvas.offsetLeft;
            event.absY = inputEvent.touches[0].pageY - this._canvas.offsetTop;
        } else {
            event.absX = inputEvent.pageX - this._canvas.offsetLeft;
            event.absY = inputEvent.pageY - this._canvas.offsetTop;
        }

        // coordinate positions relative to canvas scaling
        event.x = Math.round(event.absX * scaleFactor);
        event.y = Math.round(event.absY * scaleFactor);

        switch (event.type) {
            case this._uiEvents.MOUSE_DOWN:
            case this._uiEvents.TOUCH_START:

                this._canDrag = true;

                break;

            case this._uiEvents.MOUSE_UP:
            case this._uiEvents.TOUCH_END:

                this._canDrag = false;

                if (this._isDragging) {
                    this._isDragging = false;

                    this._queuedEvents.push(Object.assign({}, event, {
                        type: this._uiEvents.DRAG_END
                    }));
                }

                break;

            case this._uiEvents.MOUSE_MOVE:
            case this._uiEvents.TOUCH_MOVE:

                if (this._canDrag) {
                    if (!this._isDragging) {
                        this._isDragging = true;

                        this._queuedEvents.push(Object.assign({}, event, {
                            type: this._uiEvents.DRAG_START
                        }));
                    }

                    this._queuedEvents.push(Object.assign({}, event, {
                        type: this._uiEvents.DRAG
                    }));
                }

                break;
        }
    }

    /**
     * Checks for duplicate handler in the listener tyoe being added
     *
     * @method Input#_isDuplicateHandler
     * @param  {Function} handler  The handler to check
     * @param  {Array}    handlers The handlers of the listener type being added
     * @return {Boolean}
     * @private
     */
    _isDuplicateHandler(handler, handlerObjects) {
        let dup = false;

        for (let handlerObject of handlerObjects) {
            if (handler === handlerObject.handler) {
                dup = true;
                break;
            }
        }

        return dup;
    }

    /**
     * Triggers all queued events. Passes the factor and ticks from {@link Ticker}
     *
     * @method Input#_onTick
     * @param  {Object} e The event object
     */
    _onTick(e) {
        for (let event of this._queuedEvents) {
            this._triggerHandlers(event);
        }

        this._queuedEvents = [];
    }

    /**
     * executes handlers of the given event's type
     *
     * @method Input#_triggerHandlers
     * @param {object} event
     * @private
     */
    _triggerHandlers(event) {
        for (let handlerObject of this._listeners[event.type]) {

            if (handlerObject.target) {
                let hitTest = this._userHitTestMethod || this._hitTest;

                if (hitTest(event.x, event.y,
                    handlerObject.target.getBoundingArea())) {

                    event.target = handlerObject.target;

                    // if event was bound with a target trigger handler ONLY if target hit
                    handlerObject.handler(event);
                }
            } else {
                handlerObject.handler(event);
            }
        }
    }

    /**
     * Adds a handler for a certain event type
     *
     * @method Input#addListener
     * @param  {string}   type     The event type
     * @param  {function} handler  The function to execute when event triggered
     * @param  {object}   [target] The target to check event trigger against
     * @return {boolean}           Returns true if added and false if callback already exists
     */
    addListener(type, handler, target) {
        let handlerObjects = this._listeners[type];
        let dup;


        if (! handlerObjects) {
            throw new TypeError(`Event type "${type}" does not exist.`);
        }

        if (handlerObjects.length) {
            dup = this._isDuplicateHandler(handler, handlerObjects);
        }

        if (!dup) {
            handlerObjects.push({
                handler, target
            });
            return true;
        }

        return false;
    }

    /**
     * Removes matching handler if found
     *
     * @method Input#removeListener
     * @param  {string}   type    the event type
     * @param  {function} handler the handler to remove
     * @return {boolean}  removed Returns true if removed and otherwise false
     */
    removeListener(type, handler) {
        let handlers = this._listeners[type];
        let removed = false;

        if (! handlers) {
            throw new TypeError(`Event type "${type}" does not exist.`);
        }

        for (let i = 0, len = handlers.length; i < len; i++) {
            let handlerObject = handlers[i];
            if (handlerObject.handler === handler) {
                handlers.splice(i, 1);
                removed = true;
                break;
            }
        }

        return removed;
    }

    /**
     * returns an object of the keys currently being pressed
     * eg: <code>{ LEFT_ARROW: 37, UP_ARROW: 38 }</code>
     *
     * @method Input#getKeysDown
     * @return {Object}
     */
    getKeysDown() {
        return this._keysDown;
    }

    /**
     * Allows user to set a custom hit test method
     *
     * @method Input#setHitTestMethod
     * @param {Function} fn The user's hit test method
     */
    setHitTestMethod(fn) {
        if (typeof fn !== 'function') {
            throw new TypeError('Input#setHitTestMethod parameter must be a function');
        }

        this._userHitTestMethod = fn;
    }
}
