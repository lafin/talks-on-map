import React from 'react';
import Message from './Message.jsx';

class Group extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const group = this.props.group;
    return (<div className="group">
      {group.map((message, key) => {
        return <Message key={`message-id-${key}`} message={message} />;
      })}
    </div>);
  }
}

Group.propTypes = {
  group: React.PropTypes.array
};

export default Group;
