
import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

import MapGL from 'react-map-gl'
import HeatmapOverlay from 'react-map-gl-heatmap-overlay'

class Map extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      overlay: {
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
      overlay: Object.assign({}, this.state.overlay, opt)
    });
  }

  render() {
    const { talks } = this.props
    const { overlay } = this.state
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

    MapGL.fitBounds(overlay.width, overlay.height, talks.bounds);
    overlay.latitude = talks.center.latitude
    overlay.longitude = talks.center.longitude

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
