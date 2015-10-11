import React from 'react';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.messageAction = React.actions.message;
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
    const message = this.props.message;
    return (<div
      onMouseLeave={this.unselectMessage.bind(this)}
      onMouseEnter={this.selectMessage.bind(this, message.lat, message.lon)}
      className="message">{message.text}</div>);
  }
}

Message.propTypes = {
  message: React.PropTypes.object
};

export default Message;
