import { Interaction } from "discord.js";
import { MessageType } from "../types/MessageType";
import { createEmbedMessage } from "../utils/funcs";

/**
 * Middleware to check if the user is currently connected in a voice channel.
 */
export default async function inVoiceChannel(interaction: Interaction): Promise<boolean> {
  try {
    const channel = interaction.member?.voice.channel;
    if (!channel) {
      await interaction.reply(createEmbedMessage(MessageType.Error, 'You are not connected to a voice channel.'));
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};
