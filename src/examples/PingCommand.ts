import { ChatInputCommandHandler } from '../handlers/abstracts/commands/ChatInputCommandHandler.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums.js';
import { CommandInteraction } from 'discord.js';

export class PingCommand extends ChatInputCommandHandler {

    constructor() {
        super({
            name: 'ping',
            description: 'pong!',
            type: ApplicationCommandTypes.CHAT_INPUT
        });
    }

    public run(command: CommandInteraction): Promise<void> {
        return command.reply('pong!');
    }
}
