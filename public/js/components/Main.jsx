import React from 'react';
import Message from './Message.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Message messages={this.props.messages} />
      </div>
    );
  }
}

export default Main;
