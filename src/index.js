import Vunion from './vunion';
import Store from './store';
import Bus from './bus';

var store = new Store();
var bus = new Bus();

export {
    store,
    bus
}

var vunion = new Vunion();

export default vunion;