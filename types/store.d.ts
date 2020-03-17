// Type definitions for Vunion Store v__VERSION__
// Project: Vunion
// Definitions by: Johnathon Wion

export = Store

/**
 * Represents a Vunion Store.
 */
declare class Store{
    constructor();

    /**
     * Sets up the internal state to ensure this stores schema is available.
     * @param {Object} data - An object representing the schema and default values for the store.
     */
    schema(data: Object): void;

    /**
     * Gets the value of the requested property in the store.
     * @param {String} name - The name of the property to get.
     * @returns {any} - Returns the value from the store.
     */
    get(name: String): any;

    /**
     * Sets the value of the requested property in the store.
     * @param {String} name - The name of the property to get.
     * @param {any} value - The value to set for the property.
     */
    commit(name: String, value: any): void;

    /**
     * Gets the state of the Vunion as a plain JavaScript object to allow 
     * persistance or debugging.
     */
    getState(): Object;

    /**
     * Sets the state of the Vunion without disturbing existing watches and dependencies.
     * @param {Object} state - The state to set as the current state.
     * @returns {Promise} - Returns a promise that will be resolved once the state is updated.
     */
    setState(state: any): Promise;
}