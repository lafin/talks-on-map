
import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.css'

class Messages extends Component {
  render() {
    return (
      <section className={classnames(style.main, "column")}>
        <h1>Messages</h1>
      </section>
    )
  }
}

export default Messages
