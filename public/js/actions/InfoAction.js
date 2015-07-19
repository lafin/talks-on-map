import React from 'react';
import BaseAction from './BaseAction';

class InfoAction extends BaseAction {
  constructor(socket) {
    super(arguments);

    socket.on('city:info', (values) => {
      React.stores.info.set(values);
    });

    socket.emit('city:set', this.getCity());
  }

  setCity(city) {
    return localStorage.setItem('city', city);
  }

  getCity() {
    return localStorage.getItem('city') || 'Москва';
  }
}

export default InfoAction;
