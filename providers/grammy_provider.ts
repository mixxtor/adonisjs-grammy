/**
 * @mixxtor/adonisjs-grammy
 *
 * (c) Mixxtor
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Grammy from '../src/grammy.js'
import type { Update } from 'grammy/types'
import { HttpContext } from '@adonisjs/core/http'
import { GrammyConfig } from '../src/types/main.js'
import { ApplicationService } from '@adonisjs/core/types'
import { WebhookReplyEnvelope } from 'grammy'
import type { Context } from 'grammy'

export default class GrammyProvider<C extends Context = Context> {
  #bot?: Grammy<C>
  #initialized = false

  #config: GrammyConfig<C> = {
    active: true,
    apiToken: '',
  }

  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('grammy', async () => {
      const { default: Instance } = await import('../src/grammy.js')
      const config = this.app.config.get<GrammyConfig<C>>('grammy', this.#config)

      return new Instance(config)
    })
  }

  async boot() {
    const router = await this.app.container.make('router')
    const logger = await this.app.container.make('logger')
    const config = this.app.config.get<GrammyConfig<C>>('grammy', this.#config)

    const { active = true, apiToken, timeout: timeoutConfig, webhook } = config
    const { timeoutMs: ms, onTimeout: timeout } = timeoutConfig || {}
    const { routePath: webhookPath, secret: webhookSecret } = webhook || {}

    if (!active) {
      return
    }

    this.#bot = await this.app.container.make('grammy')

    if (!this.#initialized) {
      await this.#bot.init()
      this.#initialized = true
    }

    router.post(webhookPath || apiToken, async (ctx: HttpContext) => {
      if (ctx.request.header('X-Telegram-Bot-Api-Secret-Token') !== webhookSecret) {
        return ctx.response.unauthorized('secret token is wrong')
      }

      const webhookReplyEnvelope: WebhookReplyEnvelope = {
        async send(json) {
          ctx.response.ok(json)
        },
      }

      const timeoutIfNecessary = (
        task: Promise<void>,
        onTimeout: 'throw' | 'return' | ((...args: any[]) => void) = 'return',
        msTimeout?: number
      ) => {
        if (msTimeout === Infinity) {
          return task
        }

        return new Promise<void>((resolve, reject) => {
          const handle = setTimeout(() => {
            if (onTimeout === 'throw') {
              reject(new Error(`Request timed out after ${msTimeout} ms`))
            } else {
              typeof onTimeout === 'function' && onTimeout()
              resolve()
            }

            const now = Date.now()

            task.finally(() => {
              const diff = Date.now() - now
              logger.error(`Request completed ${diff} ms after timeout!`)
            })
          }, msTimeout)

          task
            .then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(handle))
        })
      }

      if (this.#bot) {
        await timeoutIfNecessary(
          this.#bot?.handleUpdate(ctx.request.body() as Update, webhookReplyEnvelope),
          typeof timeout === 'function' ? () => timeout(ctx) : timeout,
          ms
        )
      }

      return ctx.response.noContent()
    })
  }

  async shutdown() {
    await this.#bot?.stop()
  }
}
