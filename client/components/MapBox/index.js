import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import L from 'leaflet';
import style from './style.css';

class MapBox extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      overlay: {
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 10,
        url: `http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png${L.Browser.retina ? '?tag=retina' : ''}`,
        attribution: false
      }
    };
  }

  onChangeViewport(opt) {
    this.setState({
      overlay: Object.assign({}, this.state.overlay, opt)
    });
  }

  render() {
    const position = [0, 0];
    const gradient = { 0.1: 'blue', 0.2: 'lime', '1.0': 'red' };
    const { talks } = this.props;
    const points = talks.points;
    const { overlay } = this.state;

    return (
      <div className={style.main}>
        <Map center={position} {...overlay} >
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={points}
            radius={15}
            minOpacity={0.6}
            gradient={gradient}
            longitudeExtractor={point => point.longitude}
            latitudeExtractor={point => point.latitude}
            intensityExtractor={_ => 30}
          />
          <TileLayer {...overlay} />
          <Marker position={position}>
            <Popup>
              <span>A pretty CSS3 popup.<br />Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>
      </div>
    );
  }
}

MapBox.propTypes = {
  talks: React.PropTypes.shape({
    bounds: React.PropTypes.array,
    points: React.PropTypes.array
  }).isRequired
};

export default MapBox;
