import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class Header extends Component {
  render() {
    return (
      <div className={classnames(style.main)}>
        Header
      </div>
    );
  }
}

export default Header;
