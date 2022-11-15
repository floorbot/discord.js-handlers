import { ChatInputApplicationCommandData, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ApplicationCommandHandler } from '../ApplicationCommandHandler.js';

export abstract class ChatInputCommandHandler extends ApplicationCommandHandler<ChatInputCommandInteraction, ChatInputApplicationCommandData | SlashCommandBuilder> {

    /**
     * Called whenever a command interaction is received and passes the predicate. This is where all the logic should be to handle the command from start to finish
     * @param {ChatInputCommandInteraction} command The command interaction to handle
     * @returns {Promise<any>} A resolvable promise when the handler is complete
     */
    public abstract override run(command: ChatInputCommandInteraction): Promise<any>;
}
