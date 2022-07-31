import { Client, ClientOptions, Events, Interaction, InviteGenerationOptions } from "discord.js";
import { OAuth2Scopes } from 'discord-api-types/payloads/v10';
import { HandlerError } from './HandlerError.js';
import { BaseHandler } from "./BaseHandler.js";

/** Options used to construct a new handler client */
export interface HandlerClientOptions extends ClientOptions {
    /** The handlers the client uses */
    readonly handlers: BaseHandler<any>[];
    /** An array of user ids that *own* this discord bot */
    readonly ownerIDs?: string[];
}

/** A discord.js client with interaction handler functionality */
export class HandlerClient extends Client {

    /** The handlers this client uses */
    public readonly handlers: BaseHandler<any>[];
    /** The owner IDs of this discord bot */
    public readonly ownerIDs: string[];

    /**
     * Creates a handler client with specified options
     * @param options The options to build this handler
     */
    constructor(options: HandlerClientOptions) {
        super(options);
        this.ownerIDs = options.ownerIDs || [];
        this.handlers = options.handlers;
    }

    /**
     * Logs the bot into discord and sets up all the handlers
     * @param token The discord token login with
     * @returns The token used
     */
    public override async login(token?: string): Promise<string> {
        const string = await super.login(token);
        if (!this.application) throw new Error('Logged in no application');
        for (const handler of this.handlers) { await handler.setup(this); }
        this.on(Events.InteractionCreate, this.onInteractionCreate);
        return string;
    }

    /**
     * Logs the bot out of discord after destroying all associated handlers.
     */
    public override destroy(): void {
        this.handlers.reduce((promise, handler) => {
            return promise.then(() => handler.destroy(this));
        }, Promise.resolve()).then(() => super.destroy());
    }

    /**
     * An internal method to process all received interactions
     * @param interaction The interaction to process
     * @returns A resolvable promise after handling
     */
    private async onInteractionCreate(interaction: Interaction): Promise<void> {
        for (const handler of this.handlers) {
            if (handler.type !== interaction.type) continue;
            if (!handler.predicate(interaction)) continue;
            return handler.run(interaction).catch(error => {
                const handlerError = new HandlerError(handler, interaction, error);
                this.emit(Events.Error, handlerError);
            });
        }

        // Add autocomplete support for a matching command
        if (interaction.isAutocomplete()) {
            for (const handler of this.handlers) {
                if (!handler.hasAutocomplete()) continue;
                if (handler.commandData.name !== interaction.commandName) continue;
                return handler.autocomplete(interaction).catch(error => {
                    const handlerError = new HandlerError(handler, interaction, error);
                    this.emit(Events.Error, handlerError);
                });
            }
        }
    }

    /**
     * Generates an invite URL for the bot. If no options are provided "bot" and "applications.commands" scopes are used by default
     * @param options The invite options to use
     * @returns The generated bot invite URL
     */
    public override generateInvite(options?: InviteGenerationOptions): string {
        if (!options) return super.generateInvite({ scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands] });
        return super.generateInvite(options);
    }
}
