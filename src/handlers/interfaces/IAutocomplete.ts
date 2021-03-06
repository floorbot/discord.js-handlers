import { AutocompleteInteraction, ChatInputApplicationCommandData } from 'discord.js';

/** Implemented by a handler to add autocomplete functionality */
export interface IAutocomplete {

    /** The command data representing this handler */
    readonly commandData: ChatInputApplicationCommandData;

    /**
     * Called when an autocomplete interaction is received for specified command data. This is where all the autocomplete functionality should be handled
     * @param autocomplete The interaction to process
     */
    autocomplete(autocomplete: AutocompleteInteraction): Promise<any>;
}
