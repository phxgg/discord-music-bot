import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
} from 'discord.js';

import { appConfig } from '../config/appConfig';
import { MessageType } from '../types/MessageType';
import { createEmbedMessage } from '../utils/funcs';

/**
 * Middleware to check if the user is connected in the same voice channel as the bot.
 * You should not use `inSameVoiceChannel` along with `inVoiceChannel`,
 * as the `inSameVoiceChannel` middleware already checks if the user is connected in a voice channel.
 */
export default async function inSameVoiceChannel(
  interaction: ChatInputCommandInteraction | ButtonInteraction,
): Promise<boolean> {
  try {
    const botChannel = interaction?.guild?.members?.me?.voice.channel;
    if (!botChannel) {
      await interaction.reply(
        createEmbedMessage(
          MessageType.Error,
          `${appConfig.name} is not connected to a voice channel.`,
        ),
      );
      return false;
    }

    const member = interaction.member;
    const channel = (member as GuildMember).voice.channel;
    if (!channel) {
      await interaction.reply(
        createEmbedMessage(
          MessageType.Error,
          'You are not connected to a voice channel.',
        ),
      );
      return false;
    }

    if (botChannel.id !== channel.id) {
      await interaction.reply(
        createEmbedMessage(
          MessageType.Error,
          `${appConfig.name} is playing music in another voice channel.`,
        ),
      );
      return false;
    }
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return false;
  }
}
