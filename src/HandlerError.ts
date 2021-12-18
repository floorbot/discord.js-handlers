import { BaseHandler } from "./BaseHandler.js";
import { HandlerContext } from "./index.js";

/** All handlers should throw a HandlerError if possible */
export class HandlerError extends Error {

    /** The handler that has encountered an error */
    public readonly handler: BaseHandler;
    /** The optional context associated with this error */
    public readonly context?: HandlerContext;

    /** Creates a handler error with optional context and message */
    constructor(handler: BaseHandler, context?: HandlerContext, message?: string) {
        super(message);
        this.handler = handler;
        this.context = context;
    }
}
