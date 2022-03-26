import { ApplicationCommandData, ApplicationCommandType, ChatInputApplicationCommandData, ChatInputCommandInteraction, CommandInteraction, Interaction, InteractionType, MessageApplicationCommandData, MessageContextMenuCommandInteraction, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { HandlerClient } from "../../HandlerClient.js";
import { BaseHandler } from "../../BaseHandler.js";

/** An application command handler with filters for specified command data */
export abstract class ApplicationCommandHandler<I extends CommandInteraction, T extends ApplicationCommandData> extends BaseHandler<I> {

    /** The command data representing this handler */
    public readonly commandData: T;

    /**
     * Creates an application command handler with specific command data
     * @param commandData  The handlers command data
     */
    constructor(commandData: T) {
        super(InteractionType.ApplicationCommand);
        this.commandData = commandData;
    }

    /**
     * A type guard to check if the interaction is a command and the name matches this handler
     * @param interaction The interaction to check
     * @returns If the type guard passes
     */
    public predicate(interaction: Interaction): interaction is I {
        if (interaction.isChatInputCommand() && this.isChatInputApplicationCommandHandler()) return interaction.commandName === this.commandData.name;
        if (interaction.isMessageContextMenuCommand() && this.isMessageApplicationCommand()) return interaction.commandName === this.commandData.name;
        if (interaction.isUserContextMenuCommand() && this.isUserApplicationCommand()) return interaction.commandName === this.commandData.name;
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
                if (this.isChatInputApplicationCommandHandler() && command.type === ApplicationCommandType.ChatInput) return;
                if (this.isMessageApplicationCommand() && command.type === ApplicationCommandType.Message) return;
                if (this.isUserApplicationCommand() && command.type === ApplicationCommandType.User) return;
            }
        }
        await client.application.commands.create(this.commandData);
    }

    /**
     * A type guard to check if this handler is for chat input application commands
     * @returns If the type guard passes
     */
    public isChatInputApplicationCommandHandler(): this is ApplicationCommandHandler<ChatInputCommandInteraction, ChatInputApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandType.ChatInput) return true;
        if (!this.commandData.type) return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for user application commands
     * @returns If the type guard passes
     */
    public isUserApplicationCommand(): this is ApplicationCommandHandler<UserContextMenuCommandInteraction, UserApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandType.User) return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for message application commands
     * @returns If the type guard passes
     */
    public isMessageApplicationCommand(): this is ApplicationCommandHandler<MessageContextMenuCommandInteraction, MessageApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandType.Message) return true;
        return false;
    }
}
