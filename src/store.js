import Vunion from './vunion';

/**
 * Represents a Vunion Store.
 */
export default class Store {
    constructor(){
        /**
         * Sets up the internal state to ensure this stores schema is available.
         * @param {Object} data - An object representing the schema and default values for the store.
         */
        this.schema = function(data){
            // Call ensure if the internal state has already been created. 
            if (Vunion.prototype.$state != null){
                Vunion.prototype.$state.ensure(data);
            } else {
                // If not then pre-stage the store to be loaded later.
                if (Vunion.prototype.$temp == null){
                    Vunion.prototype.$temp = [];
                }
                Vunion.prototype.$temp.push(data);
            }
        }

        /**
         * Gets the value of the requested property in the store.
         * @param {string} name - The name of the property to get.
         */
        this.get = function (name) {
            return Vunion.prototype.$state.get(name);
        }
        /**
         * Sets the value of the requested property in the store.
         * @param {string} name - The name of the property to get.
         * @param {any} value - The value to set for the property.
         */
        this.commit = function (name, value) {
            Vunion.prototype.$state.commit(name, value);
        }
        /**
         * Gets the state of the Vunion as a plain JavaScript object to allow 
         * persistance or debugging.
         */
        this.getState = function() {
            return Vunion.prototype.$state.getState();
        }
        /**
         * Sets the state of the Vunion without disturbing existing watches and dependencies.
         * @param {Object} data - The data to set as the current state.
         * @returns {Promise} - Returns a promise that will be resolved once the state is updated.
         */
        this.setState = function(state) {
            return Vunion.prototype.$state.setState(state);
        }
    }
}