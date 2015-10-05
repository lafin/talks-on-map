// TODO need refactoring
/* globals JSON */

import React from 'react';

// stores
import MessageStore from './stores/MessageStore';
import InfoStore from './stores/InfoStore';
import StatsStore from './stores/StatsStore';
React.stores = {
  message: new MessageStore(),
  info: new InfoStore(),
  stats: new StatsStore()
};

import Socket from './Socket';

// actions
import MessageAction from './actions/MessageAction';
import InfoAction from './actions/InfoAction';
import StatsAction from './actions/StatsAction';
let socket = new Socket();
React.actions = {
  message: new MessageAction(socket),
  info: new InfoAction(socket),
  stats: new StatsAction(socket)
};

import Map from './Map';
let info = React.actions.info;
let map = new Map(info.getCity());
map.on('controls:change', (states) => {
  localStorage.setItem('controls', JSON.stringify(states));
});

let states = localStorage.getItem('controls');
map.setStatesControl(JSON.parse(states));
let message = React.actions.message;
info.on('city:select', (city) => {
  map.setCity(city);
  info.setCity(city);
  socket.emit('city:set', city);
});

message.on('messages:prepare', (values) => {
  if (map.canUpdate()) {
    map.prepare(values, (preparedValues, accident) => {
      React.stores.message.set(preparedValues);
      React.stores.info.set({
        accident: accident
      });
    });
  }
});

message.on('message:select', (coord) => {
  map.setMarker(coord);
});

message.on('message:unselect', (coord) => {
  map.unsetMarker(coord);
});

// routes
import { Router, Route } from 'react-router';
import createHistory from 'history/lib/createHashHistory';
import Main from './components/Main.jsx';
import Stats from './components/Stats.jsx';
import Footer from './components/Footer.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.children}
        <Footer cities={this.props.cities}
          city={this.props.city}
          level={this.props.level}
          time={this.props.time}
          online={this.props.online}
          accident={this.props.accident} />
      </div>
    );
  }
}

let history = createHistory();
React.render((
  <Router history={history}>
    <Route component={App}>
      <Route path="/" component={Main} />
      <Route path="/stats" component={Stats} />
    </Route>
  </Router>
), document.getElementById('app'));
