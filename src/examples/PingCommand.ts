import { ChatInputCommandHandler } from '../handlers/abstracts/commands/ChatInputCommandHandler.js';
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";

export class PingCommand extends ChatInputCommandHandler {

    constructor() {
        super({
            name: 'ping',
            description: 'pong!',
            type: ApplicationCommandType.ChatInput
        });
    }

    public run(command: ChatInputCommandInteraction): Promise<void> {
        return command.reply('pong!');
    }
}
