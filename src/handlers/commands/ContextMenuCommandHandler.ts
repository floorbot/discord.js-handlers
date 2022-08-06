import { ApplicationCommandType, BaseInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, InteractionType, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import { HandlerClient } from "../../HandlerClient.js";
import { BaseHandler } from "../../BaseHandler.js";

/** A context menu command handler */
export abstract class ContextMenuCommandHandler<I extends ContextMenuCommandInteraction, T extends ContextMenuCommandBuilder> extends BaseHandler<I> {

    /** The command builder representing this handler */
    public readonly commandBuilder: T;

    /**
     * Creates an application command handler with specific command builder
     * @param commandBuilder  The handlers command builder
     */
    constructor(commandBuilder: T) {
        super(InteractionType.ApplicationCommand);
        this.commandBuilder = commandBuilder;
    }

    /**
     * A type guard to check if the interaction is a command and the name matches this handler
     * @param interaction The interaction to check
     * @returns If the type guard passes
     */
    public predicate(interaction: BaseInteraction): interaction is I {
        if (interaction.isUserContextMenuCommand() && this.isUserContextMenuHandler()) return interaction.commandName === this.commandBuilder.name;
        if (interaction.isMessageContextMenuCommand() && this.isMessageContextMenuHandler()) return interaction.commandName === this.commandBuilder.name;
        return false;
    }

    /**
     * Checks if the command needs to be posted to discord
     * @param client The client to check
     * @returns A resolvable promise when setup is complete
     */
    public override async setup(client: HandlerClient): Promise<void> {
        if (!client.application) throw new Error(`Client has no application`);
        const commands = await client.application.commands.fetch();
        for (const command of commands.values()) {
            if (command.name === this.commandBuilder.name) {
                if (command.type === ApplicationCommandType.ChatInput) return;
            }
        }
        await client.application.commands.create(this.commandBuilder);
    }

    /**
     * A type guard to check if this handler is for message application commands
     * @returns If the type guard passes
     */
    public isMessageContextMenuHandler(): this is ContextMenuCommandHandler<MessageContextMenuCommandInteraction, T> {
        if (this.commandBuilder.type === ApplicationCommandType.Message) return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for user application commands
     * @returns If the type guard passes
     */
    public isUserContextMenuHandler(): this is ContextMenuCommandHandler<UserContextMenuCommandInteraction, T> {
        if (this.commandBuilder.type === ApplicationCommandType.User) return true;
        return false;
    }
}
