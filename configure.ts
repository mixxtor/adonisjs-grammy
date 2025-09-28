/**
 * @mixxtor/adonisjs-grammy
 *
 * (c) Mixxtor
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { stubsRoot } from './stubs/main.js'
import type Configure from '@adonisjs/core/commands/configure'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  /**
   * Publish config file
   */
  await codemods.makeUsingStub(stubsRoot, 'config/grammy.stub', {})

  /**
   * Add provider and preload
   */
  await codemods.updateRcFile((rcFile: any) => {
    rcFile.addProvider('@mixxtor/adonisjs-grammy/grammy_provider').addPreloadFile('#start/grammy')
  })

  /**
   * Define env variables for the selected transports
   */
  await codemods.defineEnvVariables({
    TELEGRAM_ACTIVE: true,
    TELEGRAM_BOT_TOKEN: '',
    TELEGRAM_API_WEBHOOK_SECRET: '',
  })

  /**
   * Define env variables validation for the selected transports
   */
  await codemods.defineEnvValidations({
    leadingComment: 'Variables for configuring the grammy package',
    variables: {
      TELEGRAM_ACTIVE: 'Env.schema.boolean()',
      TELEGRAM_BOT_TOKEN: 'Env.schema.string()',
      TELEGRAM_API_WEBHOOK_SECRET: 'Env.schema.string.optional()',
    },
  })
}
