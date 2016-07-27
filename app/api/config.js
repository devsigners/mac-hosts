import { join } from 'path'
import { statSync, readFileSync, writeFileSync } from 'fs'

const tryStatSync = (url) => {
  try {
    return statSync(url)
  } catch (e) {
    return false
  }
}

class Config {
  static fetchHosts(url = '/etc/hosts') {
    const stat = tryStatSync(url)
    return {
      name: 'default',
      isOriginal: true,
      content: stat ? readFileSync(url, { encoding: 'utf8' }) : '',
      birthtime: stat.birthtime,
      description: 'Original hosts'
    }
  }
  constructor(app) {
    this.userDataPath = app.getPath('userData')
    this.configPath = join(this.userDataPath, 'config')
  }
  stat() {
    return tryStatSync(this.configPath)
  }
  get(key) {
    if (!this._fetched) {
      this.config = this.stat() ? JSON.parse(readFileSync(this.configPath, {
        encoding: 'utf8'
      })) : {}
      this._fetched = true
    }
    return key == null ? this.config : this.config[key]
  }
  set(key, value) {
    if (key == null) return
    this.config[key] = value
    this._dirty = true
  }
  isDirty() {
    return !!this._dirty
  }
  save() {
    if (this.isDirty()) {
      writeFileSync(this.configPath, JSON.stringify(this.config || {}, null, '\t'))
    }
  }
}

export default Config
