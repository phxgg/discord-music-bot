import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface IBaseCommand {
  data: SlashCommandOptionsOnlyBuilder | SlashCommandBuilder;
  middleware?: Array<
    (interaction: ChatInputCommandInteraction) => Promise<boolean>
  >;
  execute(interaction: ChatInputCommandInteraction): Promise<any>;
  autocomplete?(interaction: AutocompleteInteraction): Promise<any>;
}
