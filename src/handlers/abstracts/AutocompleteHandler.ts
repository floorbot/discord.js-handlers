import { ChatInputApplicationCommandData, Interaction } from "discord.js";
import { BaseHandler } from "../../BaseHandler.js";

/** An application command autocomplete handler for specified command data */
export abstract class AutocompleteHandler extends BaseHandler {

    /** The command data representing this handler */
    public readonly commandData: ChatInputApplicationCommandData;

    /**
     * Creates an application command autocomplete handler for specific command data
     * @param commandData  The handlers command data
     */
    constructor(commandData: ChatInputApplicationCommandData) {
        super('APPLICATION_COMMAND_AUTOCOMPLETE');
        this.commandData = commandData;
    }

    /**
     * Checks the autocomplete interaction command matches this handlers command
     * @param interaction The interaction to check
     * @returns Whether this handler is for the interaction
     */
    public predicate(interaction: Interaction): boolean {
        if (!interaction.isAutocomplete()) return false;
        return interaction.commandName === this.commandData.name;
    }
}
