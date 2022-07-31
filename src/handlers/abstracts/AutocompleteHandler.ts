import { AutocompleteInteraction, ChatInputApplicationCommandData, Interaction, InteractionType } from "discord.js";
import { BaseHandler } from "../../BaseHandler.js";

/** An application command autocomplete handler for specified command data */
export abstract class AutocompleteHandler extends BaseHandler<AutocompleteInteraction> {

    /** The command data representing this handler */
    public readonly commandData: ChatInputApplicationCommandData;

    /**
     * Creates an application command autocomplete handler for specific command data
     * @param commandData  The handlers command data
     */
    constructor(commandData: ChatInputApplicationCommandData) {
        super(InteractionType.ApplicationCommandAutocomplete);
        this.commandData = commandData;
    }

    /**
     * A type guard to check if the autocomplete interaction command matches this handlers command
     * @param interaction The interaction to check
     * @returns If the type guard passes
     */
    public predicate(interaction: Interaction): interaction is AutocompleteInteraction {
        if (!interaction.isAutocomplete()) return false;
        return interaction.commandName === this.commandData.name;
    }
}
