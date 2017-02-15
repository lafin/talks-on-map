import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class Messages extends Component {
  componentDidUpdate() {
    this.messages.style.height = `${window.innerHeight - 40}px`;
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
    const groups = [];
    for (let j = 0; j < messages.length; j += 1) {
      const message = messages[j];
      let found;
      for (let i = 0; i < groups.length; i += 1) {
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
    return groups.map(group => group.sort((a, b) => a.time - b.time)).map((group) => {
      let maxLat = 0;
      let minLon = Infinity;
      group.map((message) => {
        if (message.latitude > maxLat) {
          maxLat = message.latitude;
        }
        if (message.longitude < minLon) {
          minLon = message.longitude;
        }
        return message;
      });
      return {
        maxLat,
        minLon,
        messages: group
      };
    });
  }

  render() {
    const { talks } = this.props;
    const points = talks.points;
    const groups = this.groupingMessages(points);

    return (
      <div ref={(messages) => { this.messages = messages; }} className={classnames(style.main)}>
        {groups.map(group => (
          <div key={`group-${group.maxLat}-${group.minLon}`} className={style.group}>
            {group.messages.map(message => (<div key={`message-${message.latitude}-${message.longitude}`} className={style.message}>{message.text}</div>))}
          </div>
          ))}
      </div>
    );
  }
}

Messages.propTypes = {
  talks: React.PropTypes.shape({
    city: React.PropTypes.string,
    bounds: React.PropTypes.array
  }).isRequired
};

export default Messages;
