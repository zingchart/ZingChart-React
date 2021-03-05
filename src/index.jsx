import React, { Component } from 'react';
import constants from 'zingchart-constants';
import Dompurify from "dompurify";
import zingchart from "zingchart";


const { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_OUTPUT, EVENT_NAMES, METHOD_NAMES } = constants;

// One time setup globally to handle all zingchart-react objects in the app space.
if (!window.ZCReact) {
  window.ZCReact = {
    instances: {},
    count: 0
  };
}

class ZingChart extends Component {
  constructor(props) {
    super(props);
    this.id = this.props.id || 'zingchart-react-' + window.ZCReact.count++;
    console.log(props);
    // Bind all methods available to zingchart to be accessed via Refs.
    METHOD_NAMES.forEach(name => {
      this[name] = args => {
        return window.zingchart.exec(this.id, name, args);
      };
    });
    this.state = {
      style : {
        height: this.props.height || DEFAULT_HEIGHT,
        width: this.props.width || DEFAULT_WIDTH,
      }
    };
  }
  render() {
    return (
      <div id={this.id} style={this.state.style}></div>
    );
  }

  sanitizeStrings(strings) {
    return strings.map((str) => Dompurify.sanitize(str));
  }

  sanitizeSeries(series) {
    return (series || []).map((ser) => ({
      ...(ser || {}),
      values: this.sanitizeStrings(((ser || {}).values || [])),
    }));
  }

  sanitize(data) {
    const { series } = data;
    const sanitized = this.sanitizeSeries(series);
    const clean = {
      ...data,
      series: sanitized,
    };
    return clean;
  }

  componentDidMount() {
    // Bind all events registered.
    Object.keys(this.props).forEach(eventName => {
      if (EVENT_NAMES.includes(eventName)) {
        // Filter through the provided events list, then register it to zingchart.
        window.zingchart.bind(this.id, eventName, result => {
          this.props[eventName](result);
        });
      }
    });

    this.renderChart();
  }

  // Used to check the values being passed in to avoid unnecessary changes.
  shouldComponentUpdate(nextProps) {
    // Data change
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      zingchart.exec(this.id, 'setdata', {
        data: nextProps.data,
      });

      // Series change
    } else if (JSON.stringify(nextProps.series) !== JSON.stringify(this.props.series)) {
      zingchart.exec(this.id, 'setseriesdata', {
        graphid: 0,
        plotindex: 0,
        data: nextProps.series
      });

      // Resize
    } else if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
      this.setState({
        style: {
          width: nextProps.width || DEFAULT_WIDTH,
          height: nextProps.height || DEFAULT_HEIGHT,
        },
      });
      zingchart.exec(this.id, 'resize', {
        width: nextProps.width || DEFAULT_WIDTH,
        height: nextProps.height || DEFAULT_HEIGHT,
      });
    } 

    // React should never re-render since ZingChart controls this component.
    return false;
  }

  renderChart() {
    const renderObject = {};
    Object.keys(this.props).forEach(prop => {
      renderObject[prop] = this.props[prop];
    })
    // Overwrite some existing props.
    renderObject.id = this.id;
    renderObject.width = this.props.width || DEFAULT_WIDTH;
    renderObject.height = this.props.height || DEFAULT_HEIGHT;
    renderObject.data = this.sanitize(this.props.data);
    renderObject.output = this.props.output || DEFAULT_OUTPUT;

    if (this.props.series) {
      renderObject.data.series = this.props.series;
    }
    if (this.props.theme) {
      renderObject.defaults = this.props.theme;
    }
    zingchart.render(renderObject);
  }

  componentWillUnmount() {
    zingchart.exec(this.id, 'destroy');
  }
}

// export ZingChart react class as the default
export {ZingChart as default};
