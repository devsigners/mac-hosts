import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { remote } from 'electron'
import Modal from 'react-modal'
import styles from './Home.scss'
import Editor from './editor'

const getState = (props) => {
  const res = {}
  props.list.some((hosts, i) => {
    if (hosts.selected) {
      res.selectedIndex = i
      return true
    }
  })
  return res
}
export default class Home extends Component {
  static propTypes = {
    add: PropTypes.func.isRequired,
    activate: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = getState(props)
  }
  switch(index) {
    if (index < 0 || index > this.props.list.length - 1) return
    this.props.select(index)
  }
  openHostsModal() {
    this.setState({
      hostsModalIsOpen: true
    })
  }
  closeHostsModal() {
    this.setState({
      hostsModalIsOpen: false
    })
  }
  openPwdModal() {
    this.setState({
      pwdModalIsOpen: true
    })
  }
  closePwdModal() {
    this.setState({
      pwdModalIsOpen: false
    })
  }
  addHosts() {
    const name = this.refs.hostname.value
    const description = this.refs.hostdesc.value
    if (!name) return
    this.props.add({ name, description })
    this.closeHostsModal()
    this.props.select(this.props.list.length)
  }
  delHosts(index, e) {
    e.preventDefault()
    e.stopPropagation()
    const hosts = this.props.list[index]
    if (hosts.readOnly) return
    this.props.del(index)
    if (hosts.selected) this.props.select(index - 1)
  }
  saveHostsContent(index) {
    const hosts = this.props.list[index]
    if (!hosts.selected) return
    hosts.content = this._editorState.getCurrentContent().getPlainText()
    this.props.update(index, hosts)
  }
  activateHosts(index, e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const hosts = this.props.list[index]
    if (!this._pwd) {
      return this.openPwdModal()
    }
    this.props.activate(index, this._pwd)
  }
  getPwdAndActivateHosts(index) {
    const pwd = this.refs.userpwd.value
    if (!pwd) return
    this._pwd = pwd
    this.closePwdModal()
    this.activateHosts(index)
  }
  _onContentChange(editorState) {
    this._editorState = editorState
  }
  componentWillReceiveProps(nextProps) {
    this.setState(getState(nextProps))
  }
  render() {
    const { list, icons } = this.props
    const index = this.state.selectedIndex
    const selectedHosts = list[index]
    const listLen = list.length
    return (
      <div className={styles.container}>
        <div className={styles.leftZone}>
          <div className={[styles.logoZone, styles.dragable].join(' ')}>
            <h1 className={styles.title}>macHosts</h1>
            <p className={styles.subtitle}>hosts switcher</p>
          </div>
          <div className={styles.menuZone}>
            <ul className={styles.menuList}>
              {
                list.map((item, i) => (
                  <li key={i}
                    className={[styles.item, index === i ? styles.selected : ''].join(' ')}
                    onClick={this.switch.bind(this, i)}>
                    {
                      item.active ? (<span className={styles.activeIndicator}></span>) : ''
                    }
                    <span>{item.name}</span>
                    <div className={styles.ctrlIcons}>
                      <i
                        className={["fa fa-check-circle", item.active ? styles.active : ''].join(' ')}
                        onClick={this.activateHosts.bind(this, index)}></i>
                      <i className="fa fa-trash-o" onClick={this.delHosts.bind(this, index)}></i>
                    </div>
                  </li>
                ))
              }
            </ul>
            <div className={styles.extraCtrlZone}>
              <span className={styles.ctrlButton}
                onClick={this.openHostsModal.bind(this)}>
                <i className="fa fa-plus-circle"></i> 添加
              </span>
            </div>
          </div>
        </div>
        <div className={styles.rightZone}>
          <div className={[styles.hostsMeta, styles.dragable].join(' ')}>
            <span className={styles.hostsDesc}>{selectedHosts.description}</span>
          </div>
          {
            selectedHosts ? (
              <Editor
                content={selectedHosts.content}
                onChange={this._onContentChange.bind(this)}
                onSave={this.saveHostsContent.bind(this, index)} />
            ) : null
          }
        </div>
        <Modal
          isOpen={this.state.hostsModalIsOpen}
          onRequestClose={this.closeHostsModal.bind(this)}
          overlayClassName={styles.overlay}
          className={styles.modalContent}
          closeTimeoutMS={150}>
          <span
            className={styles.modalClose}
            onClick={this.closeHostsModal.bind(this)}>
            ✕
          </span>
          <h1 className={styles.modalTitle}>Create new hosts file</h1>
          <div className={styles.modalBody}>
            <label className={styles.ctrlItem}>
              <input placeholder="Name" ref="hostname" />
            </label>
            <label className={styles.ctrlItem}>
              <input placeholder="Description" ref="hostdesc"/>
            </label>
            <div className={[styles.ctrlItem, styles.ctrlButton].join(' ')}>
              <button
                className={styles.btnAdd}
                onClick={this.addHosts.bind(this)}>
                Save
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.pwdModalIsOpen}
          onRequestClose={this.closePwdModal.bind(this)}
          overlayClassName={styles.overlay}
          className={styles.modalContent}
          closeTimeoutMS={150}>
          <span
            className={styles.modalClose}
            onClick={this.closePwdModal.bind(this)}>
            ✕
          </span>
          <h1 className={styles.modalTitle}>Input account password</h1>
          <p className={styles.modalSubtitle}>Only used to write hosts file, and automatically deleted when app quits.</p>
          <div className={styles.modalBody}>
            <label className={styles.ctrlItem}>
              <input type="password" placeholder="password" ref="userpwd" />
            </label>
            <div className={[styles.ctrlItem, styles.ctrlButton].join(' ')}>
              <button
                className={styles.btnAdd}
                onClick={this.getPwdAndActivateHosts.bind(this, index)}>
                Activate hosts
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
