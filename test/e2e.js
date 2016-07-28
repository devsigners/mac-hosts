import { Application } from 'spectron'
import { expect } from 'chai'
import electronPath from 'electron-prebuilt'
import homeStyles from '../app/components/Home.scss'

const delay = time => new Promise(resolve => setTimeout(resolve, time))

describe('main window', function spec() {
  this.timeout(5000)

  before(async () => {
    this.app = new Application({
      path: electronPath,
      args: ['.'],
    })
    return this.app.start()
  })

  after(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  const findDialogTitle = () => this.app.client.element(`.${homeStyles.modalTitle}`)

  it('should open window', async () => {
    const { client, browserWindow } = this.app

    await client.waitUntilWindowLoaded()
    await delay(500)
    const title = await browserWindow.getTitle()
    expect(title).to.equal('macHosts')
  })

  it('should to open dialog with click "添加" button', async () => {
    const { client } = this.app

    await client.click(`.${homeStyles.extraCtrlZone} .${homeStyles.ctrlButton}`)
    expect(await findDialogTitle().getText()).to.equal('Create new hosts file')
  })
})
