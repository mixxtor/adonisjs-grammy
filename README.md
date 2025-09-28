![@mixxtor/adonisjs-grammy](https://socialify.git.ci/mixxtor/adonisjs-grammy/image?description=1&descriptionEditable=Grammy%20Web%20Framework%20Adapter%20for%20AdonisJS.&font=Jost&forks=1&issues=1&logo=https%3A%2F%2Ftelegram.org%2Fimg%2Ft_logo.svg&name=1&owner=1&pattern=Charlie%20Brown&pulls=1&stargazers=1&theme=Auto)

# Introduction

`@mixxtor/adonisjs-grammy` is based on [sooluh/adonisjs-grammy](https://github.com/sooluh/adonisjs-grammy). This package makes it easy for you to integrate AdonisJS with the Telegram Bot Framework
-[Grammy](https://grammy.dev)-, allowing you to implement Webhooks instead of using Long Polling.
[Learn more here](https://grammy.dev/guide/deployment-types#how-to-use-webhooks) and find out that
Grammy doesn't support AdonisJS.

# Installation

```bash
node ace add @mixxtor/adonisjs-grammy
```

## Next steps?

1. Adjust the env configuration.
2. Create a tunnel if running on a local machine (recomended: `cloudflared` or `loophole`)
3. Set the webhook to `http://<tunneling-addres>/<bot-token>` using the following API.

   ```
   https://api.telegram.org/bot<bot-token>/setWebhook?url=http://<tunneling-address>/<bot-token>
   ```

4. Continue developing!

# Usage

Open `start/grammy.ts` and do whatever you want, as documented in the official
[Grammy documentation](https://grammy.dev/guide/getting-started).

## Example

```ts
import grammy from '@mixxtor/adonisjs-grammy/services/main'

// handle the /start command
grammy.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))

// handle other messages
grammy.on('message', (ctx) => ctx.reply('Got another message!'))
```

# Configuration

The configuration file is located at `config/grammy.ts`. Here are the available configuration options:

## Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| TELEGRAM_BOT_TOKEN | string | Yes | Your Telegram Bot API token obtained from [@BotFather](https://t.me/BotFather) |
| TELEGRAM_API_WEBHOOK_ROUTE_PATH | string | No | Optional route path of your webhook endpoint |
| TELEGRAM_API_WEBHOOK_SECRET | string | No | Optional secret key to secure your webhook endpoint |

## Configuration Options

The `config/grammy.ts` file allows you to customize the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiToken | `string` | `process.env.TELEGRAM_BOT_TOKEN` | The Telegram Bot API token |
| skipCheckToken | `boolean` | `false` | Skip checking if the API token is valid before starting the bot by `getMe` request |
| timeout | `object` | `undefined` | Webhook request timeout config |
| timeout.onTimeout | '`throw`' \| '`return`' \| `Function` | '`throw`' | Defines behavior when webhook request times out |
| timeout.timeoutMs | `number` | `10000` | Webhook request timeout in milliseconds |
| webhook | `object` | `undefined` | Webhook request timeout config |
| webhook.routePath | `string` | `apiToken` | Custom route path for the webhook endpoint |
| webhook.secret | `string` | `process.env.TELEGRAM_API_WEBHOOK_SECRET` | Optional secret key for webhook security |
| botConfig | `object` | `undefined` | Additional [bot configuration options](https://grammy.dev/ref/core/botconfig#botconfig) |

Example configuration:

```typescript
import env from '#start/env'
import { defineConfig } from '@mixxtor/adonisjs-grammy'

const grammyConfig = defineConfig({
  apiToken: env.get('TELEGRAM_BOT_TOKEN'),
  skipCheckToken: false,
  
  // Timeout handling
  timeout: {
    onTimeout: 'throw', // or 'return', or custom function
    timeoutMs: 10000, // 10 seconds
  },

  webhook: {
    // Custom route name (optional)
    routePath: env.get('TELEGRAM_API_WEBHOOK_ROUTE_PATH', 'telegram-bot'),
    secret: env.get('TELEGRAM_API_WEBHOOK_SECRET'),
  }
  
  // Additional bot configuration
  botConfig: {
    client: {
      baseFetchConfig: {
        compress: true,
      },
    },
  },
})

export default grammyConfig
```


# License

The MIT License (MIT). Please see [LICENSE](./LICENSE.md) file for more information.

# Disclaimer

This package is not officially maintained by Telegram. Telegram trademarks and logo are the
property of Telegram Messenger LLP.
