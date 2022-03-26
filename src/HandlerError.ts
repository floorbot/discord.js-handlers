import { BaseHandler } from "./BaseHandler.js";
import { HandlerContext } from "./index.js";
import { Interaction } from 'discord.js';

/** All handlers should throw a HandlerError if possible */
export class HandlerError<T extends Interaction> extends Error {

    /** The handler that has encountered an error */
    public readonly handler: BaseHandler<T>;
    /** The context associated with this error */
    public readonly context: HandlerContext;
    /** The object associated with this error */
    public readonly caught: Error | string | any;

    /** Creates a handler error with optional context and message */
    constructor(handler: BaseHandler<T>, context: HandlerContext, caught: Error | string | any) {
        if (caught instanceof Error) super(caught.message);
        else if (typeof caught === 'string') super(caught);
        else super('An unknown error has occurred');
        this.handler = handler;
        this.context = context;
        this.caught = caught;
    }
}
