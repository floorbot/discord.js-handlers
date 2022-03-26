import { IAutocomplete } from "./handlers/interfaces/IAutocomplete.js";
import { Interaction, InteractionType } from "discord.js";
import { HandlerClient } from "./index.js";

/** The base handler for any interaction with almost no restrictions */
export abstract class BaseHandler<I extends Interaction> {

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
    public abstract run(interaction: I): Promise<void>;

    /**
     * A type guard to check if this handler should run for a received interaction. Each handlers predicate is called for all received interactions until one passes which will then be run
     * @param interaction The interaction to check
     * @returns If the type guard passes
     */
    public abstract predicate(interaction: Interaction): interaction is I;

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
        return client && undefined;
    }

    /**
     * Called just before a client handler is destroyed
     * @param client The client that is being destroyed
     * @returns Once the handler is destroyed for the client
     */
    public async destroy(client: HandlerClient): Promise<void> {
        return client && undefined;
    }
}
