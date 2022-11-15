import { AutocompleteInteraction, ChatInputApplicationCommandData, SlashCommandBuilder } from 'discord.js';

/** Implemented by a handler to add autocomplete functionality */
export interface IAutocomplete {

    /** The command data representing this handler */
    readonly commandData: ChatInputApplicationCommandData | SlashCommandBuilder;

    /**
     * Called when an autocomplete interaction is received for specified command data. This is where all the autocomplete functionality should be handled
     * @param {AutocompleteInteraction} autocomplete The interaction to process
     * @returns {Promise<any>} A resolvable promise after completion
     */
    autocomplete(autocomplete: AutocompleteInteraction): Promise<any>;
}
