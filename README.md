# discord.js-handlers

A small discord.js library to handle discord interactions

## Installation

```bash
$ npm install github:floorbot/discord.js-handlers
```

## Example Handler

```ts
import { HandlerClient } from "./HandlerClient.js";
import { PingCommand } from "./examples/PingCommand.js";

const client = new HandlerClient({
    intents: [],
    handlers: [new PingCommand()]
});

client.on('ready', () => console.log(`Logged in as ${client.user?.tag}`));
client.on('error', (error: Error) => console.error(error));

client.login(/** Your Discord Token */);
```
