import React from 'react';
import Group from './Group.jsx';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages
    };
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
      messages: values
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
    const messages = this.state.messages;
    return (<div className="messages col-lg-3 col-md-3 hidden-sm hidden-xs pull-right">
      {messages.map((group, key) => {
        return <Group key={`group-id-${key}`} group={group} />;
      })}
    </div>);
  }
}

Messages.defaultProps = {
  messages: []
};

export default Messages;
