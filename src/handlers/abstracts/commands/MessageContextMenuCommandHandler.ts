import { ContextMenuCommandBuilder, MessageApplicationCommandData, MessageContextMenuCommandInteraction } from 'discord.js';
import { ApplicationCommandHandler } from '../ApplicationCommandHandler.js';

export abstract class MessageContextMenuCommandHandler extends ApplicationCommandHandler<MessageContextMenuCommandInteraction, MessageApplicationCommandData | ContextMenuCommandBuilder> {

    /**
     * Called whenever a context menu interaction is received and passes the predicate. This is where all the logic should be to handle the context menu from start to finish
     * @param contextMenu The context menu interaction to handle
     */
    public abstract override run(contextMenu: MessageContextMenuCommandInteraction): Promise<any>;
}
