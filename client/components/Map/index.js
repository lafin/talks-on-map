
import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

import MapGL from 'react-map-gl'
import HeatmapOverlay from 'react-map-gl-heatmap-overlay'

class Map extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      map: {
        width: 700,
        height: 450,
        latitude: 37.785,
        longitude: -122.459,
        zoom: 11.136,
        mapStyle: 'mapbox://styles/mapbox/streets-v8',
        mapboxApiAccessToken: 'pk.eyJ1IjoibGFmaW4iLCJhIjoiY2lrbjQ2cWs4MDA4YXcwbTRhOWZ0a2UwZSJ9.uWxtYDe0xyX4ZnilLQWcig'
      }
    }
  }

  onChangeViewport(opt) {
    this.setState({
      map: Object.assign({}, this.state.map, opt)
    });
  }

  render() {
    const { talks } = this.props
    const overlay = this.state.map
    const locations = [{
      latitude: 37.785,
      longitude: -122.459
    }, {
      latitude: 37.785,
      longitude: -122.459
    }, {
      latitude: 37.785,
      longitude: -122.459
    }, {
      latitude: 37.785,
      longitude: -122.459
    }, {
      latitude: 37.785,
      longitude: -122.459
    }]

    return (
      <MapGL
        {...overlay}
        onChangeViewport={this.onChangeViewport.bind(this)} >
        <HeatmapOverlay
          {...overlay}
          locations={locations}
          intensityAccessor={location => 1 / 10}
          sizeAccessor={location => 40} />
      </MapGL>
    )
  }
}

export default Map
