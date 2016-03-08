import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class Header extends Component {
  render() {
    return (
      <header className={classnames('header', style.main)}>
        Header
      </header>
    );
  }
}

export default Header;
