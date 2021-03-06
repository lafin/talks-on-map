import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';
import config from '../../../server/config';

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.actions = props.actions;
  }

  shouldComponentUpdate() {
    return false;
  }

  onChange(event) {
    this.actions.setCity({
      city: event.target.value
    });
  }

  render() {
    return (
      <div className={classnames(style.main)}>
        Header
        <select onChange={this.onChange}>
          {config.cities.map(city => (<option key={`city-${city.name}`}>{city.name}</option>))}
        </select>
      </div>
    );
  }
}

Header.propTypes = {
  actions: React.PropTypes.shape({
    setCity: React.PropTypes.func
  }).isRequired
};

export default Header;
