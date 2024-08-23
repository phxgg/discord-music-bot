import { appConfig } from "../config/appConfig";
import { createEmbedMessage } from "../utils/funcs";
import { MessageType } from "../types/MessageType";
import type { Interaction } from "discord.js";

/**
 * Middleware to check if the user is connected in the same voice channel as the bot.
 * You should not use `inSameVoiceChannel` along with `inVoiceChannel`,
 * as the `inSameVoiceChannel` middleware already checks if the user is connected in a voice channel.
 */
export default async function inSameVoiceChannel(interaction: Interaction): Promise<boolean> {
  try {
    const botChannel = interaction?.guild?.members?.me?.voice.channel;
    if (!botChannel) {
      await interaction.reply(createEmbedMessage(MessageType.Error, `${appConfig.name} is not connected to a voice channel.`));
      return false;
    }

    const channel = interaction?.member?.voice?.channel;
    if (!channel) {
      await interaction.reply(createEmbedMessage(MessageType.Error, 'You are not connected to a voice channel.'));
      return false;
    }

    if (botChannel.id !== channel.id) {
      await interaction.reply(createEmbedMessage(MessageType.Error, `${appConfig.name} is playing music in another voice channel.`));
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};