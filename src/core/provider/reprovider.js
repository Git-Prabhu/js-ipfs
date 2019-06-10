'use strict'

const promisify = require('promisify-es6')

const { blockKeyToCid } = require('../utils')

// const initialDelay = 10000
const initialDelay = 5000

class Reprovider {
  /**
   * Reprovider goal is t§o reannounce blocks to the network.
   * @param {object} contentRouting
   * @param {Blockstore} blockstore
   * @param {object} options
   * @memberof Reprovider
   */
  constructor (contentRouting, blockstore, options) {
    this._contentRouting = contentRouting
    this._blockstore = blockstore
    this._options = options

    this._timeoutId = undefined
  }

  /**
   * Begin processing the reprovider work and waiting for reprovide triggers
   * @returns {void}
   */
  start () {
    // Start doing reprovides after the initial delay
    this._timeoutId = setTimeout(() => {
      // start runner immediately
      this._runPeriodically()
    }, initialDelay)
  }

  /**
   * Stops the reprovider. Any active reprovide actions should be aborted
   * @returns {void}
   */
  stop () {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId)
      this._timeoutId = undefined
    }
  }

  /**
   * Run reprovide on every `options.interval` ms
   * @private
   * @returns {void}
   */
  async _runPeriodically () {
    while (this._timeoutId) {
      const blocks = await promisify((callback) => this._blockstore.query({}, callback))()

      await this._reprovide(blocks)

      // Each subsequent walk should run on a `this._options.interval` interval
      await new Promise(resolve => {
        this._timeoutId = setTimeout(resolve, this._options.interval)
      })
    }
  }

  /**
   * Do the reprovide work to libp2p content routing
   * @param {Block[]} blocks blocks in Blockstore
   * @private
   * @returns {void}
   */
  async _reprovide (blocks) { // eslint-disable-line require-await
    // TODO: Async queue
    for (let i = 0; i < blocks.length && this._timeoutId; i++) {
      // const cid = blockKeyToCid(blocks[i].key.toBuffer())

      // console.log('cid', cid)
      // TODO: needs the DHT / Content Routing
      // await promisify((callback) => {
      //   this._contentRouting.provide(cid, callback)
      // })()
    }
  }
}

exports = module.exports = Reprovider
