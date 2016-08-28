import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class Footer extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className={classnames(style.main)}>
        Footer
      </div>
    );
  }
}

export default Footer;
