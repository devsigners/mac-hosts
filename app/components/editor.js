import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  getDefaultKeyBinding,
  KeyBindingUtil
} from 'draft-js'
import React, { Component, PropTypes } from 'react'
import styles from './editor.css'

const KEYWORD_REGEX = /\s*##.*/g;
const COMMENT_REGEX = /\s*#([^#].*|$)/g;

function enhanceStrategy(contentBlock, callback) {
  findWithRegex(KEYWORD_REGEX, contentBlock, callback)
}

function commentStrategy(contentBlock, callback) {
  findWithRegex(COMMENT_REGEX, contentBlock, callback)
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr = regex.exec(text)
  let start
  while (matchArr) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
    matchArr = regex.exec(text)
  }
}

const enhanceSpan = (props) => {
  const { decoratedText, entityKey, offsetKey, ...rest } = props // eslint-disable-line
  return <span {...rest} className={styles.enhance}>{props.children}</span> // eslint-disable-line
}

const commentSpan = (props) => {
  const { decoratedText, entityKey, offsetKey, ...rest } = props // eslint-disable-line
  return <span {...rest} className={styles.comment}>{props.children}</span> // eslint-disable-line
}

const initEditorState = (props) => {
  const compositeDecorator = new CompositeDecorator([
    {
      strategy: enhanceStrategy,
      component: enhanceSpan,
    },
    {
      strategy: commentStrategy,
      component: commentSpan,
    },
  ])

  let editorState
  if (props && props.content) {
    editorState = EditorState.createWithContent(
      ContentState.createFromText(props.content),
      compositeDecorator
    )
  } else {
    editorState = EditorState.createEmpty(compositeDecorator)
  }

  return editorState
}

class HostsEditor extends Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    onSave: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      editorState: initEditorState(props),
      readOnly: props.readOnly
    }
  }
  focus() {
    this.refs.editor.focus()
  }
  onChange(editorState) {
    this.setState({ editorState })
    if (this.props.onChange) {
      this.props.onChange(editorState)
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      editorState: initEditorState(nextProps),
      readOnly: nextProps.readOnly
    })
  }
  _keyBindingFn(e) {
    if (e.keyCode === 83 /* `S` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'hosteditor-save'
    }
    return getDefaultKeyBinding(e)
  }
  _handleKeyCommand(command) {
    if (command === 'hosteditor-save') {
      if (this.props.onSave) this.props.onSave()
      return true
    }
    return false
  }
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.editor} onClick={this.focus.bind(this)}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this)}
            placeholder="write your hosts rules"
            ref="editor"
            spellCheck
            readOnly={this.state.readOnly}
            handleKeyCommand={this._handleKeyCommand.bind(this)}
            keyBindingFn={this._keyBindingFn}
          />
        </div>
      </div>
    )
  }
}

export default HostsEditor
