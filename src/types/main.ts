/**
 * @mixxtor/adonisjs-grammy
 *
 * (c) Mixxtor
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { BotConfig, Context } from 'grammy'
import Grammy from '../grammy.js'

export interface GrammyService<C extends Context = Context> extends Grammy<C> {}

export interface GrammyConfig<C extends Context = Context> {
  /**
   * Bot API token
   * @default process.env.TELEGRAM_BOT_TOKEN
   */
  apiToken: string
  /**
   * Timeout for webhook
   * @default 10000 ms
   */
  timeout?: {
    /**
     * Return or throw on timeout
     */
    onTimeout: 'throw' | 'return' | ((...args: any[]) => void)
    /**
     * Timeout in milliseconds
     */
    timeoutMs: number
  }
  webhook?: {
    /**
     * Webhook URL
     * @default process.env.TELEGRAM_API_WEBHOOK_ROUTE_PATH
     * @example '/api/telegram/webhook'
     */
    routePath: string
    /**
     * Secret token for webhook security
     * @default process.env.TELEGRAM_API_WEBHOOK_SECRET
     * @see https://core.telegram.org/bots/api#setwebhook
     * @see https://core.telegram.org/bots/webhooks#secret-token
     */
    secret: string
  }
  /**
   * Grammy bot config
   */
  botConfig?: BotConfig<C>
}
