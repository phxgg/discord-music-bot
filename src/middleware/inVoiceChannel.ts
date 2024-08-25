import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
} from 'discord.js';

import { MessageType } from '../types/MessageType';
import { createEmbedMessage } from '../utils/funcs';

/**
 * Middleware to check if the user is currently connected in a voice channel.
 */
export default async function inVoiceChannel(
  interaction: ChatInputCommandInteraction | ButtonInteraction,
): Promise<boolean> {
  try {
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
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return false;
  }
}
