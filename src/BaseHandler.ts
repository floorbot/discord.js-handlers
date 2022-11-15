import { BaseInteraction, InteractionType } from "discord.js";
import { HandlerClient } from "./index.js";

/** The base handler for any interaction with almost no restrictions */
export abstract class BaseHandler<I extends BaseInteraction> {

    /** The interaction type this handler should run for */
    public readonly type: InteractionType;

    /**
     * Creates an interaction handler for specified type
     * @param {Object} options The options for setting up this handler
     * @param {InteractionType} options.type The handlers type
     */
    constructor({ type }: { type: InteractionType; }) {
        this.type = type;
    }

    /**
     * Called whenever an interaction is received and passes the predicate. This is where all the logic should be to handle the interaction from start to finish
     * @param {I} interaction The interaction to handle
     * @returns {Promise<any>} Returns when handler is complete
     */
    public abstract run(interaction: I): Promise<any>;

    /**
     * A type guard to check if this handler should run for a received interaction. Each handlers predicate is called for all received interactions until one passes which will then be run
     * @param {BaseInteraction} interaction The interaction to check
     * @returns {boolean} If the type guard passes
     */
    public abstract predicate(interaction: BaseInteraction): interaction is I;

    /**
     * Called just after a client handler is logged in but before listening for events
     * @param {Object} options The context for setting up this handler
     * @param {HandlerClient} options.client The client that has just logged in
     * @returns {Promise<void>} Once the handler is setup for client
     */
    public async setup({ client }: { client: HandlerClient; }): Promise<void> {
        return client && undefined;
    }

    /**
     * Called just before a client handler is destroyed
     * @param {Object} options The context for destroying this handler
     * @param {HandlerClient} options.client The client that is being destroyed
     * @returns {Promise<void>} Once the handler is destroyed for the client
     */
    public async destroy({ client }: { client: HandlerClient; }): Promise<void> {
        return client && undefined;
    }
}
