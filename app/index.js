import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { ipcRenderer, remote } from 'electron';
import Config from './api/config'

import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';

const cfg = new Config(remote.app)

if (!cfg.get('hosts')) {
  const original = Config.fetchHosts()
  original.active = original.selected = true
  cfg.set('hosts', {
    list: [original],
    icons: {
      _default: 'fa-desktop',
      desktop: 'fa-desktop',
      laptop: 'fa-laptop',
      tablet: 'fa-tablet',
      mobile: 'fa-mobile',
      crossWall: 'fa-globe',
      code: 'fa-code',
      add: 'fa-plus'
    }
  })
}
const store = configureStore(cfg.get())
const history = syncHistoryWithStore(hashHistory, store)

ipcRenderer.on('before-quit', () => {
  cfg.set('hosts', store.getState().hosts)
  cfg.save()
})

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
)
