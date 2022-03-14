import { ChatInputApplicationCommandData, ChatInputCommandInteraction } from "discord.js";
import { ApplicationCommandHandler } from "../index.js";

export class PingCommand extends ApplicationCommandHandler<ChatInputApplicationCommandData> {

    constructor() {
        super({
            name: 'ping',
            description: 'pong!'
        });
    }

    public run(command: ChatInputCommandInteraction): Promise<void> {
        return command.reply('pong!');
    }
}
