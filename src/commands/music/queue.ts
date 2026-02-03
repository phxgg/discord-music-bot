import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import { IBaseCommand } from '@/commands/IBaseCommand.js';

import { MessageType } from '@/types/MessageType.js';
import logger from '@/lib/logger.js';
import Paginator from '@/lib/paginator.js';
import { createEmbedMessage, parseError } from '@/lib/utils.js';

export default class QueueCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display current queue.');

  async execute(interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(
        createEmbedMessage(MessageType.Warning, 'Player is not ready.'),
      );
    }

    const queue = useQueue(interaction.guild!.id);
    if (!queue || queue.tracks.size === 0) {
      return interaction.reply(
        createEmbedMessage(MessageType.Info, 'Queue is empty.'),
      );
    }

    await interaction.deferReply();
    try {
      const pages: EmbedBuilder[] = [];
      queue.tracks.map((track, index) => {
        if (index % 10 === 0) {
          pages.push(
            new EmbedBuilder()
              .setTitle('Queue')
              .setDescription(`Page ${pages.length + 1}`)
              .setThumbnail(queue.currentTrack?.thumbnail || null)
              .addFields(
                queue.tracks
                  .toArray()
                  .slice(index, index + 10)
                  .map((t, i) => ({
                    name: `${index + i + 1}. ${t.author} - ${t.title} (${t.duration})`,
                    value: `[Link](${t.url})`,
                  })),
              )
              .setFooter({
                text: `Total tracks in queue: ${queue.tracks.size}`,
                iconURL: (
                  queue.metadata as ChatInputCommandInteraction
                ).user.displayAvatarURL(),
              })
              .setColor(Colors.Aqua),
          );
        }
      });

      const paginator = new Paginator(pages);
      paginator.start({
        interaction: interaction,
      });
    } catch (err) {
      logger.error(`${interaction.guild!.id} -> ${err}`);
      return interaction.editReply(
        createEmbedMessage(
          MessageType.Error,
          `Something went wrong: ${parseError(err)}`,
        ),
      );
    }
  }
}
