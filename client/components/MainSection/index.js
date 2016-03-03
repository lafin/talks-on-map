
import React, { Component } from 'react'
import Map from '../Map'
import Messages from '../Messages'
import classnames from 'classnames'
import style from './style.css'

class MainSection extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { talks, actions } = this.props

    return (
      <section className={classnames(style.main, "columns")}>
        <Map talks={talks} actions={actions} />
        <Messages talks={talks} actions={actions} />
      </section>
    )
  }
}

export default MainSection
