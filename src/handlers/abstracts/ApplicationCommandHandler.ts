import { ApplicationCommand, ApplicationCommandData, ChatInputApplicationCommandData, ClientApplication, Constants, Interaction, MessageApplicationCommandData, UserApplicationCommandData } from "discord.js";
import { BaseHandler } from "../../BaseHandler.js";

const { ApplicationCommandTypes } = Constants;

/** An application command handler with filters for specified command data */
export abstract class ApplicationCommandHandler<T extends ApplicationCommandData> extends BaseHandler {

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
     * Checks the interaction is a command and the name matches this handler
     * @param interaction The interaction to check
     * @returns Whether this handler is for the interaction
     */
    public predicate(interaction: Interaction): boolean {
        if (interaction.isCommand() && this.isChatInputApplicationCommandHandler()) return interaction.commandName === this.commandData.name;
        if (interaction.isContextMenu() && this.isMessageApplicationCommand()) return interaction.commandName === this.commandData.name;
        if (interaction.isContextMenu() && this.isUserApplicationCommand()) return interaction.commandName === this.commandData.name;
        return false;
    }

    /**
     * Called when a client is logged in to check if the command needs to be posted
     * @param application The clients application to use
     * @returns This commands application command
     */
    public async syncCommand(application: ClientApplication): Promise<ApplicationCommand> {
        const commands = await application.commands.fetch();
        for (const command of commands.values()) {
            if (command.name === this.commandData.name) {
                return command;
            }
        }
        return application.commands.create(this.commandData);
    }

    /**
     * A type guard to check if this handler is for chat input application commands
     * @returns If the type guard passes
     */
    public isChatInputApplicationCommandHandler(): this is ApplicationCommandHandler<ChatInputApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandTypes.CHAT_INPUT) return true;
        if (!this.commandData.type) return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for user application commands
     * @returns If the type guard passes
     */
    public isUserApplicationCommand(): this is ApplicationCommandHandler<UserApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandTypes.USER) return true;
        if (this.commandData.type === 'USER') return true;
        return false;
    }

    /**
     * A type guard to check if this handler is for message application commands
     * @returns If the type guard passes
     */
    public isMessageApplicationCommand(): this is ApplicationCommandHandler<MessageApplicationCommandData> {
        if (this.commandData.type === ApplicationCommandTypes.MESSAGE) return true;
        if (this.commandData.type === 'MESSAGE') return true;
        return false;
    }
}
