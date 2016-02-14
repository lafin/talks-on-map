
import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

import MapGL from 'react-map-gl'
import HeatmapOverlay from 'react-map-gl-heatmap-overlay'
import Immutable from 'immutable'
import rasterTileStyle from 'raster-tile-style'

class Map extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { talks } = this.props

    const tileSource = '//tiles.maps.sputnik.ru/tiles/kmt2/{z}/{x}/{y}.png?tag=retina'
    const mapStyle = Immutable.fromJS(rasterTileStyle([tileSource]))
    const overlay = {
      width: 700,
      height: 450,
      latitude: 37.785,
      longitude: -122.459,
      zoom: 11.136
    }
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
        mapStyle={mapStyle}>
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
