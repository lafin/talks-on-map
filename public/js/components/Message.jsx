import React from 'react';

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.messageAction = React.actions.message;
    this.state = {
      group: props.group
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
    return (
      <div className="group">
        {this.state.group.map((message, key) => {
          return (<div
            key={key}
            onMouseLeave={this.unselectMessage.bind(this)}
            onMouseEnter={this.selectMessage.bind(this, message.lat, message.lon)}
            className="message">{message.text}</div>);
        })}
      </div>
    );
  }
}

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    this.messageStore = React.stores.message;
  }

  componentDidMount() {
    window.onresize = this.recalcHeight;
    this.recalcHeight();
    this.messageStore.on('update', this.onChange, this);
  }

  componentWillUnmount() {
    window.onresize = null;
    this.messageStore.removeListener('update');
  }

  onChange(values) {
    this.setState({
      message: values
    });
  }

  recalcHeight() {
    const documentHeight = document.body.clientHeight;
    const windowHeight = window.innerHeight;
    if (documentHeight >= windowHeight) {
      const messages = document.querySelector('.messages');
      if (messages) {
        messages.style.height = (windowHeight - 60) + 'px';
      }
    }
  }

  render() {
    return (
      <div className="messages col-lg-3 col-md-3 hidden-sm hidden-xs pull-right">
        {this.state.message.map((group, key) => {
          return <Group key={key} group={group} />;
        })}
      </div>
    );
  }
}

Message.defaultProps = {
  message: []
};

export default Message;
