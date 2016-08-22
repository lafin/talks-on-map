import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MainSection from '../../components/MainSection';
import MapBox from '../../components/MapBox';
import * as TalksActions from '../../actions/talks';
import classnames from 'classnames';
import io from 'socket.io-client';

import style from './style.css';
import 'bulma/css/bulma.css';

class App extends Component {
  componentDidMount() {
    const { talks, actions } = this.props;
    const socket = io();

    actions.setCity({
      socket: socket,
      city: null
    });

    socket.on('response talks', actions.setTalks);
    socket.on('response info', actions.setInfo);
  }

  render() {
    const { talks, actions, children } = this.props;

    return (
      <div className={classnames(style.main)}>
        <Header />
        <MapBox talks={talks} actions={actions} />
        <MainSection talks={talks} actions={actions} />
        <Footer />
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    talks: state.talks
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TalksActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
