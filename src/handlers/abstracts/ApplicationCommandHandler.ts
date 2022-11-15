import { ApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, BaseInteraction, ChatInputApplicationCommandData, ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandBuilder, InteractionType, MessageApplicationCommandData, MessageContextMenuCommandInteraction, SlashCommandBuilder, UserApplicationCommandData, UserContextMenuCommandInteraction } from 'discord.js';
import { IAutocomplete } from '../interfaces/IAutocomplete.js';
import { HandlerClient } from "../../HandlerClient.js";
import { BaseHandler } from "../../BaseHandler.js";

/** An application command handler with filters for specified command data */
export abstract class ApplicationCommandHandler<I extends CommandInteraction, T extends ApplicationCommandData | SlashCommandBuilder | ContextMenuCommandBuilder> extends BaseHandler<I> {

    /** The command data representing this handler */
    public readonly commandData: T;

    /**
     * Creates an application command handler with specific command data
     * @param {T} commandData  The handlers command data
     */
    constructor(commandData: T) {
        super({ type: InteractionType.ApplicationCommand });
        this.commandData = commandData;
    }

    /**
     * Called when an autocomplete interaction is received for specified command data. This is where all the autocomplete functionality should be handled
     * @param {AutocompleteInteraction} autocomplete The interaction to process
     * @returns {Promise<any>} A resolvable promise after completion
     */
    public autocomplete?(autocomplete: AutocompleteInteraction): Promise<any>;

    /**
     * A type guard to check if this handler supports (implements) autocomplete
     * @returns {boolean} If this handler has autocomplete implemented
     */
    public hasAutocomplete(): this is IAutocomplete {
        return 'autocomplete' in this && 'commandData' in this;
    }

    /**
     * A type guard to check if the interaction is a command and the name matches this handler
     * @param {BaseInteraction} interaction The interaction to check
     * @returns {boolean} If the type guard passes
     */
    public predicate(interaction: BaseInteraction): interaction is I {
        if (interaction.isCommand() && this.isChatInputCommandHandler()) return interaction.commandName === this.commandData.name;
        if (interaction.isUserContextMenuCommand() && this.isUserContextMenuHandler()) return interaction.commandName === this.commandData.name;
        if (interaction.isMessageContextMenuCommand() && this.isMessageContextMenuHandler()) return interaction.commandName === this.commandData.name;
        return false;
    }

    /**
     * Checks if the command needs to be posted to discord
     * @param {Object} options The context for setting up this handler
     * @param {HandlerClient} options.client The client to check
     * @returns {Promise<void>} A resolvable promise when setup is complete
     */
    public override async setup({ client }: { client: HandlerClient; }): Promise<void> {
        if (!client.application) throw new Error(`Client has no application`);
        const commands = await client.application.commands.fetch();
        for (const command of commands.values()) {
            if (command.name === this.commandData.name) {
                if (this.isChatInputCommandHandler() && command.type === ApplicationCommandType.ChatInput) return;
                if (this.isMessageContextMenuHandler() && command.type === ApplicationCommandType.Message) return;
                if (this.isUserContextMenuHandler() && command.type === ApplicationCommandType.User) return;
            }
        }
        await client.application.commands.create(this.commandData);
    }

    /**
     * A type guard to check if this handler is for chat input application commands
     * @returns {boolean} If the type guard passes
     */
    public isChatInputCommandHandler(): this is ApplicationCommandHandler<ChatInputCommandInteraction, ChatInputApplicationCommandData> {
        if (this.commandData instanceof SlashCommandBuilder) return true;
        if (this.commandData.type === ApplicationCommandType.ChatInput) return true;
        if (!this.commandData.type) return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for message application commands
     * @returns {boolean} If the type guard passes
     */
    public isMessageContextMenuHandler(): this is ApplicationCommandHandler<MessageContextMenuCommandInteraction, MessageApplicationCommandData> {
        if (this.commandData instanceof SlashCommandBuilder) return false;
        if (this.commandData.type === ApplicationCommandType.Message) return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for user application commands
     * @returns {boolean} If the type guard passes
     */
    public isUserContextMenuHandler(): this is ApplicationCommandHandler<UserContextMenuCommandInteraction, UserApplicationCommandData> {
        if (this.commandData instanceof SlashCommandBuilder) return false;
        if (this.commandData.type === ApplicationCommandType.User) return true;
        return false;
    }
}
