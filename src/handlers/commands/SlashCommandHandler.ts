import { ApplicationCommandType, BaseInteraction, ChatInputCommandInteraction, InteractionType, SlashCommandBuilder } from 'discord.js';
import { HandlerClient } from "../../HandlerClient.js";
import { BaseHandler } from "../../BaseHandler.js";

/** A slash command handler */
export abstract class SlashCommandHandler extends BaseHandler<ChatInputCommandInteraction> {

    /** The command builder representing this handler */
    public readonly commandBuilder: SlashCommandBuilder;

    /**
     * Creates an application command handler with specific command builder
     * @param commandBuilder  The handlers command builder
     */
    constructor(commandBuilder: SlashCommandBuilder) {
        super(InteractionType.ApplicationCommand);
        this.commandBuilder = commandBuilder;
    }

    /**
     * A type guard to check if the interaction is a command and the name matches this handler
     * @param interaction The interaction to check
     * @returns If the type guard passes
     */
    public predicate(interaction: BaseInteraction): interaction is ChatInputCommandInteraction {
        if (interaction.isCommand()) return interaction.commandName === this.commandBuilder.name;
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
}
