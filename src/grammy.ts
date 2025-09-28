/**
 * @mixxtor/adonisjs-grammy
 *
 * (c) Mixxtor
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Bot, type Context } from 'grammy'
import { GrammyConfig } from './types/main.js'
import logger from '@adonisjs/core/services/logger'

class Grammy<C extends Context = Context> extends Bot {
  constructor(config: GrammyConfig<C>) {
    if (config.active) {
      try {
        super(config.apiToken, config.botConfig)
      } catch (error) {
        logger.error(error)
      }
    }
  }
}

export default Grammy
