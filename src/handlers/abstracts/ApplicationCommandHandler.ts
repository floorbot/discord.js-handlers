import { ApplicationCommandData, BaseCommandInteraction, ChatInputApplicationCommandData, CommandInteraction, Interaction, MessageApplicationCommandData, MessageContextMenuInteraction, UserApplicationCommandData, UserContextMenuInteraction } from "discord.js";
import { ApplicationCommandTypes } from 'discord.js/typings/enums.js';
import { HandlerClient } from "../../HandlerClient.js";
import { BaseHandler } from "../../BaseHandler.js";

/** An application command handler with filters for specified command data */
export abstract class ApplicationCommandHandler<I extends BaseCommandInteraction, T extends ApplicationCommandData> extends BaseHandler<I> {

    /** The command data representing this handler */
    public readonly commandData: T;

    /**
     * Creates an application command handler with specific command data
     * @param commandData  The handlers command data
     */
    constructor(commandData: T) {
        super('APPLICATION_COMMAND');
        this.commandData = commandData;
    }

    /**
     * A type guard to check if the interaction is a command and the name matches this handler
     * @param interaction The interaction to check
     * @returns If the type guard passes
     */
    public predicate(interaction: Interaction): interaction is I {
        if (interaction.isCommand() && this.isChatInputCommandHandler()) return interaction.commandName === this.commandData.name;
        if (interaction.isMessageContextMenu() && this.isMessageContextMenuHandler()) return interaction.commandName === this.commandData.name;
        if (interaction.isUserContextMenu() && this.isUserContextMenuHandler()) return interaction.commandName === this.commandData.name;
        return false;
    }

    /**
     * Checks if the command needs to be posted to discord
     * @param client The client to check
     * @returns When the setup is complete
     */
    public override async setup(client: HandlerClient): Promise<void> {
        if (!client.application) throw new Error(`Client has no application`);
        const commands = await client.application.commands.fetch();
        for (const command of commands.values()) {
            if (command.name === this.commandData.name) {
                if (this.isChatInputCommandHandler() && command.type === 'CHAT_INPUT') return;
                if (this.isMessageContextMenuHandler() && command.type === 'MESSAGE') return;
                if (this.isUserContextMenuHandler() && command.type === 'USER') return;
            }
        }
        await client.application.commands.create(this.commandData);
    }

    /**
     * A type guard to check if this handler is for chat input application commands
     * @returns If the type guard passes
     */
    public isChatInputCommandHandler(): this is ApplicationCommandHandler<CommandInteraction, ChatInputApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandTypes.CHAT_INPUT) return true;
        if (!this.commandData.type) return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for message application commands
     * @returns If the type guard passes
     */
    public isMessageContextMenuHandler(): this is ApplicationCommandHandler<MessageContextMenuInteraction, MessageApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandTypes.MESSAGE) return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for user application commands
     * @returns If the type guard passes
     */
    public isUserContextMenuHandler(): this is ApplicationCommandHandler<UserContextMenuInteraction, UserApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandTypes.USER) return true;
        return false;
    }
}
