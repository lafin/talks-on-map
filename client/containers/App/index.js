
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import MainSection from '../../components/MainSection'
import * as TalksActions from '../../actions/talks'
import style from './style.css'
import io from 'socket.io-client';

const socket = io();

class App extends Component {
  render() {
    const { talks, actions, children } = this.props

    return (
      <div className={style.normal}>
        <Header />
        <MainSection talks={talks} actions={actions} socket={socket} />
        <Footer />
        {children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    talks: state.talks
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TalksActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
