import { BaseHandler } from "./BaseHandler.js";
import { BaseInteraction } from 'discord.js';
import { HandlerContext } from "./index.js";

export type HandlerErrorOptions<T extends BaseInteraction> = {
    /** The handler that has encountered an error */
    handler: BaseHandler<T>;
    /** The context associated with this error */
    context: HandlerContext;
    /** The object associated with this error */
    caught: Error | string | any;
};

/** All handlers should throw a HandlerError if possible */
export class HandlerError<T extends BaseInteraction> extends Error {

    /** The handler that has encountered an error */
    public readonly handler: BaseHandler<T>;
    /** The context associated with this error */
    public readonly context: HandlerContext;
    /** The object associated with this error */
    public readonly caught: Error | string | any;

    /**
     * Creates a handler error with optional context and message
     * @param {HandlerErrorOptions<T>} options The options and context for this error
     */
    constructor({ handler, context, caught }: HandlerErrorOptions<T>) {
        if (caught instanceof Error) super(caught.message);
        else if (typeof caught === 'string') super(caught);
        else super('An unknown error has occurred');
        this.handler = handler;
        this.context = context;
        this.caught = caught;
    }
}
