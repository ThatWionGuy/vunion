import Store from './store';
import State from './state';
import Bus from './bus';

/**
 * The Vunion API.
 */
export default class Vunion {
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
            }
        }
        
        /**
         * Vunion version number.
         */
        this.version = '__VERSION__'
    }
}