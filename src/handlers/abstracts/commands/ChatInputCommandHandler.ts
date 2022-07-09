import { ChatInputApplicationCommandData, CommandInteraction } from 'discord.js';
import { ApplicationCommandHandler } from '../ApplicationCommandHandler.js';

export abstract class ChatInputCommandHandler extends ApplicationCommandHandler<CommandInteraction, ChatInputApplicationCommandData> {

    /**
     * Called whenever a command interaction is received and passes the predicate. This is where all the logic should be to handle the command from start to finish
     * @param command The command interaction to handle
     */
    public abstract override run(command: CommandInteraction): Promise<void>;
}
