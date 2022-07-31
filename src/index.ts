import { BaseInteraction, Message } from "discord.js";

export type HandlerContext = BaseInteraction | Message;

export * from './BaseHandler.js';
export * from './HandlerError.js';
export * from './HandlerClient.js';

export * from './handlers/interfaces/IAutocomplete.js';

export * from './handlers/abstracts/AutocompleteHandler.js';
export * from './handlers/abstracts/ApplicationCommandHandler.js';

export * from './handlers/abstracts/commands/ChatInputCommandHandler.js';
export * from './handlers/abstracts/commands/UserContextMenuCommandHandler.js';
export * from './handlers/abstracts/commands/MessageContextMenuCommandHandler.js';
