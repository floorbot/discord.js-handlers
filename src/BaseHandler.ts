import { IAutocomplete } from "./handlers/interfaces/IAutocomplete.js";
import { Interaction, InteractionType } from "discord.js";
import { HandlerClient } from "./index.js";

/** The base handler for any interaction with almost no restrictions */
export abstract class BaseHandler {

    /** The interaction type this handler should run for */
    public readonly type: InteractionType;

    /**
     * Creates an interaction handler for specified type
     * @param type The handlers type
     */
    constructor(type: InteractionType) {
        this.type = type;
    }

    /**
     * Called whenever an interaction is received and passes the predicate. This is where all the logic should be to handle the interaction from start to finish
     * @param interaction The interaction to handle
     */
    public abstract run(interaction: Interaction): Promise<void>;

    /**
     * Called to check if this handler should run for a received interaction. Each handlers predicate is called for all received interactions until one passes which will then be run
     * @param interaction The interaction to check
     * @returns Whether this handler should run for the interaction
     */
    public abstract predicate(interaction: Interaction): boolean;

    /**
     * A type guard to check if this command supports (implements) autocomplete
     * @returns boolean
     */
    public hasAutocomplete(): this is IAutocomplete {
        return 'autocomplete' in this && 'commandData' in this;
    }

    /**
     * Called just after a client handler is logged in but before listening for events
     * @param client The client that has just logged in
     * @returns Once the handler is setup for client
     */
    public async setup(client: HandlerClient): Promise<void> {
        return BaseHandler.setup(client);
    }

    /**
     * Called just before a client handler is destroyed
     * @param client The client that is being destroyed
     * @returns Once the handler is destroyed for the client
     */
    public async destroy(client: HandlerClient): Promise<void> {
        return BaseHandler.destroy(client);
    }

    /**
     * Called whenever this handler encounters an error
     * @param error The error encountered (this can be anything)
     * @param interaction The interaction that resulted in an error
     */
    public async onError(error: any, interaction: Interaction): Promise<void> {
        BaseHandler.onError(error, interaction);
    }

    /**
     * A static setup method all handlers will call if not otherwise overridden
     * @param client The client that has just logged in
     * @returns Once the handler is setup for client
     */
    public static async setup(_client: HandlerClient): Promise<void> {
        return;
    }

    /**
     * A static destroy method all handlers will call if not otherwise overridden
     * @param client The client that is being destroyed
     * @returns Once the handler is destroyed for the client
     */
    public static async destroy(_client: HandlerClient): Promise<void> {
        return;
    }

    /**
     * A static onError method all handlers will call if not otherwise overridden
     * @param error The error encountered (this can be anything)
     * @param interaction The interaction that resulted in an error
     */
    public static async onError(error: any, interaction: Interaction): Promise<void> {
        console.error(`${this.constructor.name} has run into an error`, error, interaction);
    }
}
