import { ChatInputCommandHandler } from '../handlers/abstracts/commands/ChatInputCommandHandler.js';
import { ApplicationCommandType, CommandInteraction } from 'discord.js';

export class PingCommand extends ChatInputCommandHandler {

    constructor() {
        super({
            name: 'ping',
            description: 'pong!',
            type: ApplicationCommandType.ChatInput
        });
    }

    public run(command: CommandInteraction): Promise<any> {
        return command.reply('pong!');
    }
}
