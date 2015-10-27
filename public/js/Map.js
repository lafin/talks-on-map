// TODO need refactoring

/* globals L */
const EventEmitter = require('eventemitter3');

class Map extends EventEmitter {
  constructor(cityName) {
    super();
    this._checkZoomRange = false;
    this._canUpdate = true;
    this._statesControl = {
      showAccidents: true,
      showHeatMap: true
    };
    this.cityName = cityName;
    this.init((map, heatmap, markers, accidents) => {
      this.map = map;
      this.heatmap = heatmap;
      this.markers = markers;
      this.accidents = accidents;
    });
  }

  canUpdate() {
    return this._canUpdate;
  }

  init(callback = function() {}) {
    let map;
    let heatmap;
    let markers;
    let accidents;
    L.Icon.Default.imagePath = 'vendor/image';
    map = L.map('map', {
      attributionControl: false,
      minZoom: 10,
      maxZoom: 15,
      detectRetina: true
    })
    .setView([0, 0]);
    L.tileLayer('http://tiles.maps.sputnik.ru/tiles/kmt2/{z}/{x}/{y}.png' + (L.Browser.retina ? '?tag=retina' : '')).addTo(map);
    heatmap = L.heatLayer([], {
      max: 0.2,
      gradient: {
        0.1: 'blue',
        0.2: 'lime',
        1.0: 'red'
      }
    }).addTo(map);
    markers = new L.FeatureGroup();
    map.addLayer(markers);
    accidents = new L.FeatureGroup();
    map.addLayer(accidents);
    map.on('dragstart', () => {
      this._canUpdate = false;
    }).on('dragend', () => {
      this._canUpdate = true;
    });
    map.whenReady(callback.bind(this, map, heatmap, markers, accidents));
    L.easyButton('glyphicon-bell', this.showAccidentsToggle.bind(this), '', map);
    L.easyButton('glyphicon-flag', this.showHeatMapToggle.bind(this), '', map);

  }

  setStatesControl(states) {
    this._statesControl = states || this._statesControl;
    this.showHeatMapToggle(!this._statesControl.showHeatMap);
    this.showAccidentsToggle(!this._statesControl.showAccidents);
  }

  getStatesControl() {
    return this._statesControl;
  }

  showHeatMapToggle(visible) {
    const canvas = this.heatmap._canvas;
    if (visible === undefined) {
      visible = canvas.style.display !== 'none';
    }
    if (visible) {
      canvas.style.display = 'none';
    } else {
      canvas.style.display = '';
    }
    this._statesControl.showHeatMap = canvas.style.display !== 'none';
    this.emit('controls:change', this.getStatesControl());
  }

  showAccidentsToggle(visible) {
    if (visible === undefined) {
      visible = this.map.hasLayer(this.accidents);
    }
    if (visible) {
      this.map.removeLayer(this.accidents);
    } else {
      this.map.addLayer(this.accidents);
    }
    this._statesControl.showAccidents = this.map.hasLayer(this.accidents);
    this.emit('controls:change', this.getStatesControl());
  }

  setCity(value) {
    this.cityName = value;
    this._checkZoomRange = false;
  }

  setMarker(coord) {
    const marker = L.marker([coord.lat, coord.lot]);
    this.markers.addLayer(marker);
  }

  unsetMarker() {
    this.markers.clearLayers();
  }

  addAccidentMarker(point) {
    const icon = L.icon({
      iconUrl: 'vendor/image/notice_dtp.png',
      iconRetinaUrl: 'vendor/image/notice_dtp.png',
      iconSize: [32, 32]
    });
    const accident = L.marker([point.coords.lat, point.coords.lon], {
      icon: icon
    });
    this.accidents.addLayer(accident);
  }

  distance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const p = Math.PI / 180;
    const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 +
        Math.cos(lat1 * p) * Math.cos(lat2 * p) *
        (1 - Math.cos((lon2 - lon1) * p)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  findClusterWithNearPoint(clusters, coord) {
    let i = 0;
    if (!clusters.length) {
      return 0;
    }
    for (; i < clusters.length; i++) {
      const cluster = clusters[i];
      if (cluster) {
        for (const point of cluster) {
          const dist = this.distance(point.lat, point.lon, coord.lat, coord.lon);
          if (dist < 1) {
            return i;
          }
        }
      } else {
        return 0;
      }
    }
    return i;
  }

  prepareMessages(preparedMessages) {
    const clusters = [];
    for (const coord of preparedMessages) {
      const currentCluster = this.findClusterWithNearPoint(clusters, coord);
      if (!clusters[currentCluster]) {
        clusters[currentCluster] = [];
      }
      clusters[currentCluster].push(coord);
    }
    const sortFn = (a, b) => {
      a = a.time;
      b = b.time;
      let result = 0;
      if (a < b) {
        result = -1;
      } else if (a > b) {
        result = 1;
      }
      return result;
    };
    for (const cluster of clusters) {
      cluster.sort(sortFn);
    }
    return clusters;
  }

  prepare(data, callback = function() {}) {
    this.accidents.clearLayers();
    const messages = data.messages;
    const city = data.city;
    const addressMessages = [];
    const preparedMessages = [];
    let countAccident = 0;
    for (let i = 0; i < messages.length; i++) {
      const point = messages[i];
      preparedMessages[i] = {
        text: point.text,
        time: point.time,
        lat: point.coords.lat,
        lon: point.coords.lon
      };
      if (point.type === 0) {
        countAccident += 1;
        this.addAccidentMarker(point);
      }
      addressMessages.push([point.coords.lat, point.coords.lon]);
    }
    if (!this._checkZoomRange && city.name === this.cityName) {
      this.map.fitBounds([
          [city.coords.tl_lat, city.coords.tl_lon],
          [city.coords.br_lat, city.coords.br_lon]
      ]);
      this._checkZoomRange = true;
    }
    this.heatmap.setLatLngs(addressMessages);
    return callback(this.prepareMessages(preparedMessages), countAccident);
  }
}

export default Map;
