import { Client, ClientOptions, Constants, Interaction } from "discord.js";
import { BaseHandler } from "./BaseHandler.js";

const { Events } = Constants;

/** Options used to construct a new handler client */
export interface HandlerClientOptions extends ClientOptions {
    /** The handlers the client uses */
    readonly handlers: BaseHandler[];
    /** An array of user ids that *own* this discord bot */
    readonly ownerIDs?: string[];
}

/** A discord.js client with interaction handler functionality */
export class HandlerClient extends Client {

    /** The handlers this client uses */
    public readonly handlers: BaseHandler[];
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
        this.on(Events.INTERACTION_CREATE, this.onInteractionCreate);
        return string;
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
                handler.onError(error, interaction);
                this.emit(Events.ERROR, error);
            });
        }

        // Add autocomplete support for a matching command
        if (interaction.isAutocomplete()) {
            for (const handler of this.handlers) {
                if (!handler.hasAutocomplete()) continue;
                if (handler.commandData.name !== interaction.commandName) continue;
                return handler.autocomplete(interaction).catch(error => {
                    handler.onError(error, interaction);
                    this.emit(Events.ERROR, error);
                });
            }
        }
    }
}
