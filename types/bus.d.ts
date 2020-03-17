// Type definitions for Vunion Bus v__VERSION__
// Project: Vunion
// Definitions by: Johnathon Wion

export = Bus

/**
 * Represents the Vunion Bus.
 */
declare class Bus{
    constructor();

    /**
     * Trigger an event on the event bus. Any additional arguments will be passed 
     * into the listener’s callback function. 
     * @param {String} event - The event to emit.
     * @param {Array<any>} args - The arguments to pass with the event.
     */
    $emit(event: String, args: Array<any>): void;

    /**
     * Listen for a custom event on the event bus. 
     * Events can be triggered by bus.emit. The callback will receive all the additional 
     * arguments passed into these event-triggering methods.
     * @param {String | Array<String>} event - The name(s) of the event(s) to listen for.
     * @param {Function} eventHandler - A function(args) to call whenever the event occurs.
     */
    $on(event: String | Array<String>, eventHandler: Function): void;

    /**
     * Listen for a custom event on the event bus, but only once. 
     * The listener will be removed once it triggers for the first time.
     * @param {String} event - The name of the event to listen for on.
     * @param {Function} eventHandler - A function(args) to call when the event occurs.
     */
    $once(event: String, eventHandler: Function): void;

    /**
     * Remove custom event listener(s) from the event bus. 
     * If no arguments are provided, remove all event listeners; 
     * If only the event is provided, remove all listeners for that event; 
     * If both event and callback are given, remove the listener for that specific callback only.
     * @param {String} event - The name of the event to listen for on.
     * @param {Function} eventHandler - A function(args) to call when the event occurs.
     */
    $off(event: String, eventHandler: Function): void;
}