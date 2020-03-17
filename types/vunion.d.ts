// Type definitions for Vunion Bus v__VERSION__
// Project: Vunion
// Definitions by: Johnathon Wion

import Store from './store';
import Bus from './bus';
import { VueConstructor } from 'vue/types/umd';

export = Vunion

/**
 * Represents the Vunion API.
 */
declare class Vunion{
    constructor();

    /**
     * Provides access to the Vunion Store.
     */
    store: Store;

    /**
     * Provides access to the Vunion Event Bus.
     */
    bus: Bus;

    /**
     * Vue Plugin Install Method activated by saying Vue.use(vunion).
     * @param {VueConstructor} Vue - The Vue Construction function.
     */
    install(Vue: VueConstructor): void
    
    /**
     * Vunion version number.
     */
    version: String
}
