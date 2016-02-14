
import React, { Component } from 'react'
import Map from '../Map'
import Message from '../Message'
import style from './style.css'

class MainSection extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { talks, actions } = this.props

    return (
      <section className={style.main}>
        <Map />
        <Message />
      </section>
    )
  }
}

export default MainSection
