![](https://img.shields.io/npm/v/zingchart-react)
![](https://github.com/zingchart/zingchart-react/workflows/Build/badge.svg?branch=master)
![](https://github.com/zingchart/zingchart-react/workflows/Test/badge.svg?branch=master)
![](https://img.shields.io/npm/dw/zingchart-react)

![](https://img.shields.io/david/zingchart/zingchart-react)
![](https://img.shields.io/david/peer/zingchart/zingchart-react)
![](https://img.shields.io/david/dev/zingchart/zingchart-react)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![](https://d2ddoduugvun08.cloudfront.net/items/1L0T1l1e0v2t150Q3e1y/Screen%20Recording%202020-06-04%20at%2011.47%20PM.gif?X-CloudApp-Visitor-Id=3179966)](https://codesandbox.io/s/zingchart-react-wrapper-example-dxfc9)

## Quickstart Guide

Quickly add charts to your React application with our ZingChart component

This guide assumes some basic working knowledge of React and jsx.


## 1. Install

Install the `zingchart-react` package via npm

`npm install zingchart-react`

## 2. Include the `zinchart` package in your project

The `zingchart` package is a **DIRECT** dependency of `zingchart-react` but you can also update this package outside of this component. Meaning the wrapper is no longer tied to a ZingChart library version, but just the component itself.

You can import the library like so:

```javascript
// import the es6 version
import 'zingchart/es6';
```

## 3. Include the component in your project 

You can either include the zingchart-react component to your project via UMD or modules (reccomended).


### Modules (reccomended)
```js
import 'zingchart/es6';
import ZingChart from 'zingchart-react';
```

You must **EXPLICITLY IMPORT MODULE CHARTS**. The modules are 
wrapped as a closure an eval statement so there is **NO** default
export objects. Just import them.

```js
import 'zingchart/es6';
import ZingChart from 'zingchart-react';
// EXPLICITLY IMPORT MODULE from node_modules
import "zingchart/modules-es6/zingchart-maps.min.js";
import "zingchart/modules-es6/zingchart-maps-usa.min.js";
```

### UMD

In your main html file, include the package as a script include.
```html
<script src="/path/to/zingchart.min.js"></script>
<script src="/path/to/zingchart-react.js"></script>
```

### `zingchart` Global Objects

If you need access to the `window.zingchart` objects for licensing or development flags.

```javascript
import zingchart from 'zingchart/es6';
import ZingChart from 'zingchart-react';

// zingchart object for performance flags
zingchart.DEV.KEEPSOURCE = 0; // prevents lib from storing the original data package
zingchart.DEV.COPYDATA = 0; // prevents lib from creating a copy of the data package 

// ZC object for license key
zingchart.LICENSE = ['abcdefghijklmnopqrstuvwxy'];
```

## Usage

Use the newly imported `ZingChart` component in your markup.


```jsx
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        type: 'bar',
        series: [{
          values: [4,5,3,4,5,3,5,4,11]
        }]
      }
    }
  }
  render() {
    return (
      <div >
        <ZingChart data={this.state.config}/>
      </div>
    );
  }

}
```


## Parameters

The properties, or parameters, you can pass to the `<zingchart>` tag itself.


### data [object]

```jsx

const myData = {
    type: 'line',
    series: [
      { values: [1,2,4,5,6] }
    ]
};

<zingchart data={myData}></zingchart>
```

### `id` [string] (optional)
The id for the DOM element for ZingChart to attach to. If no id is specified, the id will be autogenerated in the form of zingchart-react-#

### `series` [array] (optional)
Accepts an array of series objects, and overrides a series if it was supplied into the config object. Varries by chart type used - Refer to the ZingChart documentation for more details.


```jsx
const myData = {
    type: 'line',
};

const mySeries = [
  { values: [1,2,4,5,6] }
];

<zingchart data={myData} series={mySeries}></zingchart>

```

### `width` [string or number] (optional)

The width of the chart. **Defaults to 100%**.

### `height` [string or number] (optional)

The height of the chart. **Defaults to 480px**.

### `theme` [object] (optional)

The theme or 'defaults' object defined by ZingChart. More information available here: https://www.zingchart.com/docs/api/themes

### `output` [string] (optional)

The render type of the chart. **The default is `svg`** but you can also pass the string `canvas` to render the charts in canvas. 

## Events
All zingchart events are readily available on the component to listen to. For example, to listen for the 'complete' event when the chart is finished rendering:

```jsx
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        type: 'line',
        series: [{
          values: [4,5,3,4,5,3,5,4,11]
        }]
      }
    }
    this.chartDone = this.chartDone.bind(this);
  }
  render() {
    return (
      <div>
        <ZingChart data={this.state.config} complete={this.chartDone}/>
      </div>
    );
  }
  chartDone(event) {
    console.log(`Event "Complete" - The chart is rendered\n`);
  }
}
```

For a list of all the events that you can listen to, refer to the complete documentation on https://www.zingchart.com/docs/events


### Methods

All zingchart methods are readily available on the component's instance to call. For example, to add a new plot node to the chart:

```jsx
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        type: 'bar',
        series: [{
          values: [4,5,3,4,5,3,5,4,11]
        }]
      }
    };
    this.chart = React.createRef();
    this.addPlot = this.addPlot.bind(this);

  }
  render() {
    return (
      <div>
        <ZingChart ref={this.chart} data={this.state.config}/>
        <button onClick={this.addPlot}>AddPlot</button>
      </div>
    );
  }
  addPlot() {
    this.chart.current.addplot({
      data: {
        values: [5,3,3,5,6,4,3,4,6],
        text: "My new plot"
      }
    });
  }
}

```

For a list of all the methods that you can call and the parameters each method can take, refer to the complete documentation on https://www.zingchart.com/docs/methods

## Working Example

This repository contains a "Create React App" example to give you an easy way to see the component in action. 

To start the sample application:
```
cd example && npm run start 
```
