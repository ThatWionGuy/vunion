import Vunion from "./vunion"

/**
 * Represents the Vunion Bus.
 */
export default class Bus{
    constructor(){
        /**
         * Trigger an event on the event bus. Any additional arguments will be passed 
         * into the listener’s callback function. 
         * @param {String} event - The event to emit.
         * @param {Array<any>} args - The arguments to pass with the event.
         */
        this.$emit = function(event, ...args){
            Vunion.prototype.$state.$vm.$emit(`vunion:bus:${event}`, ...args);
        }

        /**
         * Listen for a custom event on the event bus. 
         * Events can be triggered by bus.emit. The callback will receive all the additional 
         * arguments passed into these event-triggering methods.
         * @param {String | Array<String>} event - The name(s) of the event(s) to listen for.
         * @param {Function} eventHandler - A function(args) to call whenever the event occurs.
         */
        this.$on = function(event, eventHandler){
            if (typeof event === 'array'){
                for (let e = 0; e < event.length; e++) {
                    const ev = event[e];
                    Vunion.prototype.$state.$vm.$on(`vunion:bus:${ev}`, eventHandler);
                }
            } else {
                Vunion.prototype.$state.$vm.$on(`vunion:bus:${event}`, eventHandler);
            }
        }

        /**
         * Listen for a custom event on the event bus, but only once. 
         * The listener will be removed once it triggers for the first time.
         * @param {String} event - The name of the event to listen for on.
         * @param {Function} eventHandler - A function(args) to call when the event occurs.
         */
        this.$once = function(event, eventHandler){
            Vunion.prototype.$state.$vm.$once(`vunion:bus:${event}`, eventHandler);
        }

        /**
         * Remove custom event listener(s) from the event bus. 
         * If no arguments are provided, remove all event listeners; 
         * If only the event is provided, remove all listeners for that event; 
         * If both event and callback are given, remove the listener for that specific callback only.
         * @param {String} event - The name of the event to listen for on.
         * @param {Function} eventHandler - A function(args) to call when the event occurs.
         */
        this.$off = function(event, eventHandler){
            var eventName = null;
            if (event != null){
                eventName = `vunion:bus:${event}`
            }
            Vunion.prototype.$state.$vm.$off(eventName, eventHandler);
        }
    }
}