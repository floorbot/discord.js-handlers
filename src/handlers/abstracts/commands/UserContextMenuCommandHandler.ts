import { ContextMenuCommandBuilder, UserApplicationCommandData, UserContextMenuCommandInteraction } from 'discord.js';
import { ApplicationCommandHandler } from '../ApplicationCommandHandler.js';

export abstract class UserContextMenuCommandHandler extends ApplicationCommandHandler<UserContextMenuCommandInteraction, UserApplicationCommandData | ContextMenuCommandBuilder> {

    /**
     * Called whenever a context menu interaction is received and passes the predicate. This is where all the logic should be to handle the context menu from start to finish
     * @param {UserContextMenuCommandInteraction} contextMenu The context menu interaction to handle
     * @returns {Promise<any>} A resolvable promise when the handler is complete
     */
    public abstract override run(contextMenu: UserContextMenuCommandInteraction): Promise<any>;
}
