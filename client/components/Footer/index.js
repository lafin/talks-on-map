import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class Footer extends Component {
  render() {
    return (
      <footer className={classnames('footer', style.main)}>
        <h1>Footer</h1>
      </footer>
    );
  }
}

export default Footer;
