import React from 'react';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.messageAction = React.actions.message;
    this.state = {
      message: props.message
    };
  }

  selectMessage(lat, lot) {
    this.messageAction.emit('message:select', {
      lat: lat,
      lot: lot
    });
  }

  unselectMessage() {
    this.messageAction.emit('message:unselect');
  }

  render() {
    const message = this.state.message;
    return (<div
      onMouseLeave={this.unselectMessage.bind(this)}
      onMouseEnter={this.selectMessage.bind(this, message.lat, message.lon)}
      className="message">{message.text}</div>);
  }
}

export default Message;
