import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import 'bulma/css/bulma.css';
import style from './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Messages from '../../components/Messages';
import MapBox from '../../components/MapBox';
import * as TalksActions from '../../actions/talks';

class App extends Component {
  componentDidMount() {
    const { talks, actions } = this.props;

    actions.setCity({
      city: null
    });
  }

  render() {
    const { talks, actions, children } = this.props;

    return (
      <div className={classnames(style.main)}>
        <Header actions={actions} />
        <MapBox talks={talks} actions={actions} />
        <Messages talks={talks} actions={actions} />
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
