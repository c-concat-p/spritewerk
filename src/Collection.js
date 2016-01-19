/**
 * @class       Collection
 * @description Provides the sortable, iterable storage of entities that are
 *              gettable, settable, sortable, removable, etcera(ble) by name
 * @author      Chris Peters
 */
export default class Collection {
    constructor() {
        /**
         * @member {Array} The sorted list
         * @private
         */
        this._items = [];
    }

    /**
     * Returns a raw item by name
     *
     * @param  {String} name
     * @return {Any}
     * @private
     */
    _getRawItem(name) {
        let item;

        this._rawEach(function(iterItem, i, iterName) {
            if (name === iterName) {
                item = iterItem;

                return false;
            }
        });

        return item;
    }

    /**
     * Iterates the collection's sorted items. The raw item, index, name, and the
     * list being iterated are supplied to the provided function
     *
     * @param {function} fn
     * @private
     */
    _rawEach(fn) {
        for(var i = 0, len = this._items.length; i < len; i += 1) {
            if (fn(this._items[i], i, this._items[i].name, this._items) === false) {
                break;
            }
        }
    }

    /**
     * Add an item with optional name
     *
     * @param  {Any}        item   The item to add
     * @param  {String}     [name] The optional name of the item
     * @return {Collection}
     */
    addItem(item, name) {
        name = name || '';

        this._items.push({
            item, name
        });

        return this;
    }

    /**
     * Add multiple items
     *
     * @param {...Object} items Can be the object itself or an object containing the entity and it's name
     *                          eg: { item: Entity, name: 'entityName' }
     * @return {Collection}
     */
    addItems(...items) {
        for (let item of items) {
            if (typeof item.item === 'object' && typeof item.name === 'string') {
                // if item has item/name structure
                this.addItem(item.item, item.name);
            } else {
                // for convenience allow user to add just item
                this.addItem(item);
            }
        }

        return this;
    }

    /**
     * Iterates the collection's sorted items. The item, index, and name are supplied to the provided function
     *
     * @param {Function} fn      Truth predicate
     * @param {Object}   [scope] Scope
     */
    each(fn, scope) {
        fn = scope ? fn.bind(scope) : fn;

        for (var i = 0, len = this._items.length; i < len; i++) {
            let item = this._items[i];

            if (fn(item.item, i, item.name) === false) {
                break;
            }
        }
    }

    /**
     * iterates items and return the ones that meet criteria
     *
     * @param  {Function} fn      Truth predicate
     * @param  {Object}   [scope] Scope
     * @return {Array}
     */
    filter(fn, scope) {
        let filteredItems = [];

        this.each((item, i, name)=> {
            let filteredItem = fn(item, i, name);

            if (filteredItem) {
                filteredItems.push(filteredItem);
            }
        }, scope);

        return filteredItems;
    }

    /**
     * Returns a list of just the items
     *
     * @return {Array}
     */
    getItemArray() {
        return this._items.map((item)=> {
            return item.item;
        });
    }

    /**
     * Returns an existing item by name
     *
     * @param  {String} name The name of the item
     * @return {Any}
     */
    getItem(name) {
        let item;

        this.each((iterItem, i, iterName)=> {
            if (name === iterName) {
                item = iterItem;

                return false;
            }
        });

        return item;
    }

    /**
     * Returns an existing item by name index
     *
     * @param  {Integer} index
     * @return {Any}
     */
    getItemAt(index) {
        return this._items[index].value;
    }

    /**
     * Returns the count of items in collection
     *
     * @return {Integer}
     */
    getItemCount() {
        return this._items.length;
    }

    /**
     * Returns an item's current index
     *
     * @param  {String} name
     * @return {Integer}
     */
    getItemIndex(name) {
        let index;

        this.each((iterItem, i, iterName)=> {
            if (name === iterName) {
                index = i;

                return false;
            }
        });

        return index;
    }

    /**
     * Removes all items from collection
     */
    removeAllItems() {
        this._items = [];
    }

    /**
     * Removes an object by name
     *
     * @method SW.Collection.prototype.removeItem
     * @param {String} name
     */
    removeItem(name) {
        this._rawEach((iterItem, i, iterName, items)=> {
            if (name === iterName) {
                iterItem = null;
                items.splice(i, 1);

                // break out of loop
                return false;
            }
        });
    }

    /**
     * Assigns a new value to an existing item
     *
     * @param {String} name
     * @param {Any}    value
     */
    setItem(name, value) {
        this._each((iterItem, i, iterName)=> {
            if (name === iterName) {
                iterItem.value = value;

                // break out of loop
                return false;
            }
        });
    }

    /**
     * Moves item to new index
     *
     * @param  {String} name
     * @param  {Integer} index
     */
    setItemIndex(name, index) {
        let item;
        let currentIndex = this.getItemIndex(name);

        if (index === currentIndex) {
            return;
        }

        item = this._getRawItem(name);
        this.removeItem(name);
        this._items.splice(index, 0, item);
    }
}
