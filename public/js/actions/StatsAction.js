import React from 'react';
import BaseAction from './BaseAction';

class StatsAction extends BaseAction {
  constructor(socket) {
    super(arguments);
    this.socket = socket;
    socket.on('city:stats', (values) => {
      React.stores.stats.set(values);
    });
  }

  getStats(city) {
    this.socket.emit('city:stats', city);
  }
}

export default StatsAction;
