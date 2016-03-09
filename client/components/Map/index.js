import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';
import Immutable from 'immutable';

import MapGL from 'react-map-gl';
import HeatmapOverlay from 'react-map-gl-heatmap-overlay';

class Map extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      overlay: {
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 0,
        mapStyle: 'mapbox://styles/mapbox/streets-v8',
        mapboxApiAccessToken: 'pk.eyJ1IjoibGFmaW4iLCJhIjoiY2lrbjQ2cWs4MDA4YXcwbTRhOWZ0a2UwZSJ9.uWxtYDe0xyX4ZnilLQWcig'
      }
    };
  }

  onChangeViewport(opt) {
    this.setState({
      overlay: Object.assign({}, this.state.overlay, opt)
    });
  }

  render() {
    const { talks } = this.props;
    const locations = talks.points;
    let { overlay } = this.state;

    overlay = Object.assign({}, overlay, {
      height: window.innerHeight,
      width: window.innerWidth
    });
    if (!overlay.zoom) {
      overlay = Object.assign({}, overlay, MapGL.fitBounds(overlay.height, overlay.width, talks.bounds));
    }

    return (
      <div className={style.main}>
        <MapGL
          {...overlay}
          onChangeViewport={this.onChangeViewport.bind(this)} >
          <HeatmapOverlay
            {...overlay}
            locations={locations}
            gradientColors={Immutable.List(['lightskyblue', 'lime', 'yellow', 'orange', 'red'])}
            intensityAccessor={locations => 1 / 10}
            sizeAccessor={locations => 40} />
        </MapGL>
      </div>
    );
  }
}

export default Map;
