import { IAutocomplete } from "./handlers/interfaces/IAutocomplete.js";
import { Interaction, InteractionType } from "discord.js";

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
     * Called whenever an interaction is received and passes the predicate. This is where all the logic should be to handle the interaction from start to finish.
     * @param interaction The interaction to handle
     */
    public abstract run(interaction: Interaction): Promise<void>;

    /**
     * Called to check if this handler should run for a received interaction. Each handlers predicate is called for all received interactions until one passes which will then be run.
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
}
