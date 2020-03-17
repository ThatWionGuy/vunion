# vunion Event Bus

The Event Bus is an optional feature provided in ```vunion``` to allow you to emit and listen to Global Events.  Each event is isolated to the Bus alone, so no other $on's will be triggered by Bus Events.  Also these events are available in any Component so it can help facilitate Component to Component communication. 

You can access the bus two different ways and both ways expose the exact same functionality.

## Through the vunion module

Anywhere in your code you can import the bus through vunion module and then interact with it from there.

``` js
// Import vunion module
import vunion from 'vunion';
// Then access the bus
vunion.bus.$emit('my-event');

//    or

// Import the bus named export.
import {bus} from 'vunion';

// Then interact with it
bus.$emit('my-event', optional, args, toPass);

bus.$on('my-event', function(...args){
    // Do something when the event is emitted.
})

```

## Through the Vue Instance

The other way to access the bus is through any Vue instance.

Component script section:
``` html
<script>
export default {
    mounted(){
        this.$vunion.bus.$emit('my-event');
    }
}
</script>
```

## Event Bus API

Since we are utilizing the Vue event system as the backbone of the bus, it follows/mirrors the [Vue Event API](https://vuejs.org/v2/api/#Instance-Methods-Events).  All methods exposed ($emit, $on, $once, $off) are exactly the same as the Vue instance methods so it is easy to change your existing events to Bus events if you wish to.

## Under the hood and Debugging

If you want to have a better understanding of how the bus is working and how to debug it.  Check out our [Debugging Section](./DEBUG.md).