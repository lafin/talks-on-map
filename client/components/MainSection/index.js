
import React, { Component } from 'react'
import Map from '../Map'
import Message from '../Message'
import style from './style.css'

class MainSection extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { talks, actions, socket } = this.props
    socket.emit('get points')
    socket.on('get points', () =>
      actions.getTalks()
    );
  }

  render() {
    const { talks, actions } = this.props

    return (
      <section className={style.main}>
        <Map talks={talks} actions={actions} />
        <Message talks={talks} actions={actions} />
      </section>
    )
  }
}

export default MainSection
