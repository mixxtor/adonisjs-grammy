/**
 * @mixxtor/adonisjs-grammy
 *
 * (c) Mixxtor
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { GrammyConfig } from './types/main.js'
import type { Context } from 'grammy'

export function defineConfig<
  C extends Context = Context,
  T extends GrammyConfig<C> = GrammyConfig<C>,
>(config: T): T {
  return config
}
