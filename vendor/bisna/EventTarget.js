define(
    [],
    function () {
        "use strict";

        /**
         * Create and initialize a new EventTarget instance.
         *
         */
        var EventTarget = function () {
            this.listenerList = {};
        };

        EventTarget.prototype = {
            /**
             * Dispose EventTarget instance
             *
             */
            dispose: function () {
                var type;

                for (type in this.listenerList) {
                    if (this.listenerList.hasOwnProperty(type)) {
                        this.listenerList[type] = null;

                        delete this.listenerList[type];
                    }
                }

                this.listenerList = {};
            },

            /**
             * Add a new event listener
             *
             * @param type    Event type
             * @param handler Event handler function
             * @param scope   Event scope object
             *
             * @return EventTarget
             */
            addEventListener: function (type, handler, scope) {
                var listenerTypeList;

                scope            = scope || this;
                listenerTypeList = this.listenerList[type];

                if (listenerTypeList === undefined) {
                    this.listenerList[type] = [];
                }

                this.listenerList[type].push({
                    handler: handler,
                    scope:   scope
                });

                return this;
            },

            /**
             * Remove an existing event listener
             *
             * @param type    Event type
             * @param handler Event handler function
             *
             * @return EventTarget
             */
            removeEventListener: function (type, handler) {
                var listenerTypeList,
                    index = 0,
                    length;

                listenerTypeList = this.listenerList[type];

                if (listenerTypeList === undefined) {
                    return this;
                }

                for (length = listenerTypeList.length; index < length; index = index + 1) {
                    if (listenerTypeList[index].handler === handler) {
                        listenerTypeList.splice(index, 1);

                        break;
                    }
                }

                if (listenerTypeList.length === 0) {
                    this.listenerList[type] = null;

                    delete this.listenerList[type];
                }

                return this;
            },

            /**
             * Check existence of an event listener
             *
             * @param type Event type
             *
             * @return boolean Event listener existence
             */
            hasEventListener: function (type) {
                var listenerTypeList = this.listenerList[type];

                return (listenerTypeList !== undefined && listenerTypeList.length > 0);
            },

            /**
             * Dispatch an event
             *
             * @param type    Event type or Event object
             * @param data    Event data object
             * @param target  Event target object
             *
             * @return boolean Flag referring if event is preventing default action
             */
            dispatchEvent: function (type, data, target) {
                var listenerTypeList,
                    index = 0,
                    event = ((typeof type === 'object') ? type : this.createEvent(type, data, target)),
                    length;

                listenerTypeList = this.listenerList[event.type];

                if (listenerTypeList === undefined) {
                    return true;
                }

                for (length = listenerTypeList.length; index < length; index = index + 1) {
                    if (event.stopPropagation) {
                        break;
                    }

                    event.currentTarget = listenerTypeList[index].scope;

                    listenerTypeList[index].handler.call(event.currentTarget, event);
                }

                return !event.preventDefault;
            },

            createEvent: function (type, data, target) {
                return {
                    type:            type,
                    target:          target || this,
                    currentTarget:   this,
                    userData:        data || null,
                    stopPropagation: false,
                    preventDefault:  false
                };
            }
        };

        return EventTarget;
    }
);