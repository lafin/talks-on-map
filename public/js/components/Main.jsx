import React from 'react';
import Message from './Message.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages
    };
  }

  render() {
    return (
      <div>
        <Message messages={this.state.messages} />
      </div>
    );
  }
}

export default Main;
