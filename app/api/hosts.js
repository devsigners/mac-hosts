import { exec } from 'child_process'
import { join } from 'path'
import { writeFile, accessSync, W_OK } from 'fs'

export const writeHosts = (content, cb, pwd) => {
  try {
    accessSync('/etc/hosts', W_OK)
    writeFile('/etc/hosts', content, cb)
  } catch (e) {
    writeFile('/tmp/__yhost_tmp__', content, (err) => {
      if (err) {
        return cb(err)
      }
      exec(`echo ${pwd} | sudo -S cp /tmp/__yhost_tmp__ /etc/hosts`, cb)
    })
  }
}
