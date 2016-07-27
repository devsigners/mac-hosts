import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as HostActions from '../actions/hosts';

function mapStateToProps(state) {
  return state.hosts
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HostActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);