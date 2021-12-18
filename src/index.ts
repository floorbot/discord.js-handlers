import { Interaction, Message } from "discord.js";

export type HandlerContext = Interaction | Message;

export * from './BaseHandler.js';
export * from './HandlerError.js';
export * from './HandlerClient.js';

export * from './handlers/interfaces/IAutocomplete.js';

export * from './handlers/abstracts/AutocompleteHandler.js';
export * from './handlers/abstracts/ApplicationCommandHandler.js';
