
import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class Messages extends Component {
  constructor(props, context) {
    super(props, context);
  }

  distance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const p = Math.PI / 180;
    const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 +
        Math.cos(lat1 * p) * Math.cos(lat2 * p) *
        (1 - Math.cos((lon2 - lon1) * p)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  groupingMessages(messages) {
    messages = [].concat(messages);
    let groups = [];
    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      let found;
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        found = group.find(msg => this.distance(msg.latitude, msg.longitude, message.latitude, message.longitude) < 1);
        if (found) {
          group[group.length] = message;
          break;
        }
      }
      if (!found) {
        groups[groups.length] = [message];
      }
    }
    return groups.map(group => group.sort((a, b) => a.time - b.time));
  }

  render() {
    const { talks } = this.props;
    const points = talks.points;
    const groups = this.groupingMessages(points);

    return (
      <section className={classnames(style.main, 'column')}>
        <h1>Messages</h1>
        {groups.map((group, key) => {
          return (
            <div key={`group-${key}`} className={style.group}>
            {group.map((message, key) => {
              return (<div key={`message-${key}`} className={style.message}>{message.text}</div>);
            })}
            </div>
          );
        })}
      </section>
    );
  }
}

export default Messages;
