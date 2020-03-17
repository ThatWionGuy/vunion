import Vunion from './vunion';

const target = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {}
const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

/**
 * Represents the Vunion State.
 */
export default class State {
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
                    })
                    sm.$vm.$nextTick(function () {
                        // Flush the events on the next tick.
                        sm.devTools.flush();
                    })
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
        }
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
        }
        sm.ensure = function (data, force, parent) {
            if (Vunion.prototype.$isCompApi){
                //TODO: Add Vue3 comp logic here
                throw "Vunion does not currently support Vue 3's composition api.  We are working on a version that will support this once Vue 3 is Production Ready";
            } else {
                var rootData = parent || sm.$vm._data.state
                
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
        }
        function getMap(name){
            var properties = [name];
            if (name.indexOf('.') > 0){
                properties = name.split('.');
            } else if (name.indexOf('/') > 0){
                properties = name.split('/');
            }
            var workingState = null;
            if(Vunion.prototype.$isCompApi){
                //TODO: Add Vue3 comp logic here
            } else {
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
        }
        sm.commit = function (name, value) {
            var map = getMap(name);
            map.obj[map.prop] = value;
            sm.devTools.emit('state:commit', { commit: name, value: value });
        }
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
        }
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
        }
    }
}