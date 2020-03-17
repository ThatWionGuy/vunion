# Vunion APIs

Here is a list of all Vunion APIs so that you can use them to research the best way to create your store the way you want to.

## Vunion

This is the core module for ```vunion``` that exposes the all aspects of the plugin.

``` js
import vunion from 'vunion'
```

The following methods and properties are accessible:

<table>
    <thead>
        <tr>
            <th>Entry Point</th>
            <th>Type</th>
            <th>Usage</th>
        </th>
    </thead>
    <tbody>
        <tr>
            <td style="vertical-align:top">store</td>
            <td style="vertical-align:top">Property</td>
            <td style="vertical-align:top">
                <span>Access to the Store API</span>
            </td>
        </tr>
        <tr>
            <td style="vertical-align:top">bus</td>
            <td style="vertical-align:top">Property</td>
            <td style="vertical-align:top">
                <span>Access to the Bus API</span>
            </td>
        </tr>
        <tr>
            <td style="vertical-align:top">install(Vue)</td>
            <td style="vertical-align:top">Method</td>
            <td style="vertical-align:top">
                <span>Vue plugin install method.</span>
                <p>
                    Vue calls this when you say: Vue.use(vunion);
                </p>
            </td>
        </tr>
        <tr>
            <td style="vertical-align:top">version</td>
            <td style="vertical-align:top">Property</td>
            <td style="vertical-align:top">
                <span>The installed version number.</span>
            </td>
        </tr>
    </tbody>
</table>

## Store

This is the store module that exposes the all interactions with the store.

``` js
import vunion from 'vunion';
vunion.store
```

Or by named export:

``` js
import {store} from 'vunion';
```

The following methods and properties are accessible:

<table>
    <thead>
        <tr>
            <th>Entry Point</th>
            <th>Type</th>
            <th>Usage</th>
        </th>
    </thead>
    <tbody>
        <tr>
            <td style="vertical-align:top">schema(data)</td>
            <td style="vertical-align:top">Method</td>
            <td style="vertical-align:top">
                <span>Ensures that the passed in schema is in the vunion reactive state.</span>
                <p>This should be called when you are defining a store.</p>
                <p>The <b>"data"</b> property is an object that contains the properties to map into the reactive state with their default values.</p>
                <p>If the property already exists in the state then it leaves the current value as is.  If it does not exist it adds it and sets it's value to the default.</p>
            </td>
        </tr>
        <tr>
            <td style="vertical-align:top">get(name)</td>
            <td style="vertical-align:top">Method</td>
            <td style="vertical-align:top">
                <span>Gets the value of a property in the vunion reactive state.</span>
                <p>The <b>"name"</b> parameter is the string name of the property you wish to return.</p>
                <p>If you are using structured objects in your state then you will need the full path the property you want to return using namespacing</p>
                <p>You can use <b>'/'</b> or <b>'.'</b> characters in your namespacing, either work.</p>
            </td>
        </tr>
        <tr>
            <td style="vertical-align:top">commit(name, value)</td>
            <td style="vertical-align:top">Method</td>
            <td style="vertical-align:top">
                <span>Sets the value of a property in the vunion reactive state.</span>
                <p>The <b>"name"</b> parameter is the string name of the property you wish to return.</p>
                <p>The <b>"value"</b> parameter is the value of the property you are trying to set. Can be any type.</p>
                <p>For <b>"name"</b> the same namespacing rules apply as in the above get method.</p>
            </td>
        </tr>
        <tr>
            <td style="vertical-align:top">getState()</td>
            <td style="vertical-align:top">Method</td>
            <td style="vertical-align:top">
                <span>Returns the entire vunion state as a plain JavaScript object.</span>
            </td>
        </tr>
        <tr>
            <td style="vertical-align:top">setState(state)</td>
            <td style="vertical-align:top">Method</td>
            <td style="vertical-align:top">
                <span>Sets the entire vunion reactive state based on a plain JavaScript object.</span>
                <p>The <b>"state"</b> parameter is a plan JavaScript object that will be used to map the properties and values into the state.</p>
                <p>Any existing properties of the same name will have their values set to the passed in values.</p>
            </td>
        </tr>
    </tbody>
</table>

## Bus

This is the event bus module that exposes the all interactions with the event bus.

``` js
import vunion from 'vunion';
vunion.bus
```

Or by named export:

``` js
import {bus} from 'vunion';
```

Since we are utilizing the Vue event system as the backbone of the bus, it follows/mirrors the [Vue Event API](https://vuejs.org/v2/api/#Instance-Methods-Events).  All methods exposed ($emit, $on, $once, $off) are exactly the same as the Vue instance methods so it is easy to change your existing events to Bus events if you wish to.
