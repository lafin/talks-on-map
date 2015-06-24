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
        map.prepare(values, (values, accident) => {
            React.stores.message.set(values);
            React.stores.info.set({
                accident: accident
            });
        });
    })
    .on('message:select', (coord) => {
        map.setMarker(coord);
    })
    .on('message:unselect', (coord) => {
        map.unsetMarker(coord);
    });

// routes
import Router from 'react-router';
import Main from './components/Main.jsx';
import Stats from './components/Stats.jsx';
import Footer from './components/Footer.jsx';

let DefaultRoute = Router.DefaultRoute;
let Route = Router.Route;
let RouteHandler = Router.RouteHandler;

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <RouteHandler />
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

let routes = (<Route name="app" handler={App}>
    <Route name="main" path="/" handler={Main} />
    <Route name="stats" path="/stats" handler={Stats} />
    <DefaultRoute handler={Main} />
</Route>);
Router.run(routes, function (Handler) {
    React.render(<Handler city={info.getCity()} />, document.getElementById('app'));
});