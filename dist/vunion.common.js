'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Represents a Vunion Store.
 */
class Store {
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
        };

        /**
         * Gets the value of the requested property in the store.
         * @param {string} name - The name of the property to get.
         */
        this.get = function (name) {
            return Vunion.prototype.$state.get(name);
        };
        /**
         * Sets the value of the requested property in the store.
         * @param {string} name - The name of the property to get.
         * @param {any} value - The value to set for the property.
         */
        this.commit = function (name, value) {
            Vunion.prototype.$state.commit(name, value);
        };
        /**
         * Gets the state of the Vunion as a plain JavaScript object to allow 
         * persistance or debugging.
         */
        this.getState = function() {
            return Vunion.prototype.$state.getState();
        };
        /**
         * Sets the state of the Vunion without disturbing existing watches and dependencies.
         * @param {Object} data - The data to set as the current state.
         * @returns {Promise} - Returns a promise that will be resolved once the state is updated.
         */
        this.setState = function(state) {
            return Vunion.prototype.$state.setState(state);
        };
    }
}

const target = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {};
const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/**
 * Represents the Vunion State.
 */
class State {
    constructor(vm) {
        var sm = this;
        sm.$vm = vm;
        sm.devTools = {
            _buffer: [],
            /**
             * Provides access to the Vue Dev Tools browser extension.
             * @param {string} message - The message to send.
             * @param {Object} data - Optional Data to send with the message. 
             */
            emit: function(message, ...data){
                if(devtoolHook && Vunion.prototype.devTools){
                    var currentState = sm.getState(true);
                    sm.devTools._buffer.push({ 
                        message: message,
                        data: data,
                        currentState: { state: currentState }
                    });
                    sm.$vm.$nextTick(function () {
                        // Flush the events on the next tick.
                        sm.devTools.flush();
                    });
                }
            },
            flush(){
                if(sm.devTools._buffer.length > 0){
                    if(devtoolHook.Vue != null){
                        // Copy buffer to scoped variable to prevent subsequent flush calls from running.
                        var bufferedEvents = sm.devTools._buffer;
                        sm.devTools._buffer = [];
                        // Go through each event and emit it with the VueModel.
                        for (let i = 0; i < bufferedEvents.length; i++) {
                            const event = bufferedEvents[i];
                            if (event.data != null){
                                sm.$vm.$emit(`vunion:${event.message}`, ...event.data, event.currentState);
                            } else {
                                sm.$vm.$emit(`vunion:${event.message}`, event.currentState);
                            }

                            //TODO: Add Vuex Dev Tools Support
                            // if (devtoolHook && Vunion.prototype.devTools){
                            //     var currentState = sm.getState();
                            //     if (data != null){
                            //         devtoolHook.emit(`vuex:${message}`, data, currentState);
                            //     } else {
                            //         devtoolHook.emit(`vuex:${message}`, currentState);
                            //     }
                            // }
                        }
                    } else {
                        // Dev Tool Hook has not connected with Vue.  
                        // Try flush again next tick.
                        window.setTimeout(function () {
                           // Flush the events on the next tick.
                           sm.devTools.flush();
                        }, 100);
                    }
                }
                
            }
        };
        sm.init = function(){
            if (Vunion.prototype.$isCompApi){
                //TODO: Add Vue3 comp logic here
                throw "Vunion does not currently support Vue 3's composition api.  We are working on a version that will support this once Vue 3 is Production Ready";
            } else {
                // Ensure that the vunion state object is in the _data.
                if (sm.$vm._data.state == undefined){
                    sm.$vm._data.state = {};
                    // Walk the data object to make the vunion state an observable.
                    sm.$vm._data.__ob__.walk(sm.$vm._data);
                }
            }
            
            sm.devTools.emit('init');
            
            // Add any pre-staged stores if they need to be added.
            if (Vunion.prototype.$temp != null && Vunion.prototype.$temp.length > 0){
                for (let i = 0; i < Vunion.prototype.$temp.length; i++) {
                    const data = Vunion.prototype.$temp[i];
                    sm.ensure(data);
                }
            }
        };
        sm.ensure = function (data, force, parent) {
            if (Vunion.prototype.$isCompApi){
                //TODO: Add Vue3 comp logic here
                throw "Vunion does not currently support Vue 3's composition api.  We are working on a version that will support this once Vue 3 is Production Ready";
            } else {
                var rootData = parent || sm.$vm._data.state;
                
                // Go though each of the data properties.
                for (var property in data) {
                    if (data.hasOwnProperty(property)) {
                        if (rootData[property] == undefined) {
                            // If the property does not already exist, add it as is.
                            rootData[property] = data[property];
                        } else if (typeof data[property] === 'object'){
                            // If the property does exist and the property is an object 
                            // We need to recursively call ensure to crawl that objects properties.
                            sm.ensure(data[property], force, rootData[property]);
                        } else if (force){
                            // Lastly if the property exists and is not an object and we are forcing the value.
                            rootData[property] = data[property];
                        }
                    }
                }
                // Only re-walk the vunion state object if this is the initial call.
                if(parent == null){
                    // Walk the vunion state object to make sure all of it's properties are an observable.
                    sm.$vm._data.state.__ob__.walk(sm.$vm._data.state);
                    sm.devTools.emit('load', data);
                }
            }
        };
        function getMap(name){
            var properties = [name];
            if (name.indexOf('.') > 0){
                properties = name.split('.');
            } else if (name.indexOf('/') > 0){
                properties = name.split('/');
            }
            var workingState = null;
            if(Vunion.prototype.$isCompApi); else {
                workingState = sm.$vm._data.state;
            }
            for (let i = 0; i < properties.length; i++) {
                const property = properties[i];
                if (workingState[property] == undefined) {
                    throw `You must first add the property ${property} to the store when you created it with new Store(object)`
                }
                if (i == properties.length - 1) {// Last property in the chain, return it.
                    return {
                        obj: workingState,
                        prop: property
                    };
                } 
                // Set the workingState to this property and move on.
                workingState = workingState[property];
            }
        }
        sm.get = function (name) {
            var map = getMap(name);
            sm.devTools.emit('state:get', name);
            return map.obj[map.prop];
        };
        sm.commit = function (name, value) {
            var map = getMap(name);
            map.obj[map.prop] = value;
            sm.devTools.emit('state:commit', { commit: name, value: value });
        };
        sm.getState = function(suppressLog){
            if (sm.$vm === undefined){
                throw 'Ensure that you have used vunion in your Vue application "Vue.use(vunion)" and that the Vue app has been mounted prior to calling getState()'
            }
            var currentState = sm.$vm._data.state;
            var exportedState = JSON.parse(JSON.stringify(currentState));
            if(!suppressLog){
                sm.devTools.emit('state:exported');
            }
            return exportedState;
        };
        sm.setState = function(data, suppressLog){
            if (typeof Promise === 'undefined'){
                throw 'vunion requires a Promise polyfill in this browser to support setState.';
            }
            if (sm.$vm === undefined){
                throw 'Ensure that you have used vunion in your Vue application "Vue.use(vunion)" and that the Vue app has been mounted prior to calling setState()'
            }
            return new Promise(function(resolve, reject) {
                try{
                    // We cannot just replace the vunion state object because any watches would be destroyed.  
                    // We need to call the ensure with force to allow the store to roll through all properties and 
                    // make sure that they are present and their values are correct.  This will preserve any existing watches.
                    sm.ensure(data, true);
                    if(!suppressLog){
                        sm.devTools.emit('state:imported');
                    }
                    resolve();
                } catch(err) {
                    reject(err);
                }
            });
        };
    }
}

/**
 * Represents the Vunion Bus.
 */
class Bus{
    constructor(){
        /**
         * Trigger an event on the event bus. Any additional arguments will be passed 
         * into the listener’s callback function. 
         * @param {String} event - The event to emit.
         * @param {Array<any>} args - The arguments to pass with the event.
         */
        this.$emit = function(event, ...args){
            Vunion.prototype.$state.$vm.$emit(`vunion:bus:${event}`, ...args);
        };

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
        };

        /**
         * Listen for a custom event on the event bus, but only once. 
         * The listener will be removed once it triggers for the first time.
         * @param {String} event - The name of the event to listen for on.
         * @param {Function} eventHandler - A function(args) to call when the event occurs.
         */
        this.$once = function(event, eventHandler){
            Vunion.prototype.$state.$vm.$once(`vunion:bus:${event}`, eventHandler);
        };

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
                eventName = `vunion:bus:${event}`;
            }
            Vunion.prototype.$state.$vm.$off(eventName, eventHandler);
        };
    }
}

/**
 * The Vunion API.
 */
class Vunion {
    constructor(){
        /**
         * Provides access to the Vunion Store.
         */
        this.store = new Store();
        /**
         * Provides access to the Vunion Event Bus.
         */
        this.bus = new Bus();
        /**
         * Vue Plugin Install Method activated by saying Vue.use(vunion).
         * @param {VueConstructor} Vue - The Vue Construction function.
         */
        this.install = function(Vue) {
            Vue.prototype.$vunion = this;
            Vunion.prototype.devTools = Vue.config.devtools || false;
            var mountFunc = Vue.prototype.$mount;
            Vue.prototype.$mount = function(el, hydrating){
                if (Vunion.prototype.$state === undefined){
                    var stateVm = new Vue({
                        name: 'Vunion',
                        data: {
                            state: {}
                        }
                    });
                    this.$children.push(stateVm);
                    Vunion.prototype.$isCompApi = stateVm._data === undefined;
                    var state = new State(stateVm);
                    state.init();
                    Vunion.prototype.$state = state;
                }
                Vue.prototype.$mount = mountFunc;
                return this.$mount(el, hydrating);
            };
        };
        
        /**
         * Vunion version number.
         */
        this.version = '1.0.0-alpha.10';
    }
}

var store = new Store();
var bus = new Bus();

var vunion = new Vunion();

exports.bus = bus;
exports.default = vunion;
exports.store = store;
