import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { IBaseCommand } from '@/commands/IBaseCommand';

import logger from '@/lib/logger';

export default class StatsCommand implements IBaseCommand {
  data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Application stats')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const promises = [
      interaction.client.shard?.fetchClientValues('guilds.cache.size'),
      interaction.client.shard?.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      ),
    ];

    Promise.all(promises)
      .then((results) => {
        const totalGuilds = results[0]?.reduce(
          (acc: any, guildCount: any) => acc + guildCount,
          0,
        );
        const totalMembers = results[1]?.reduce(
          (acc: any, memberCount: any) => acc + memberCount,
          0,
        );

        const { heapUsed, heapTotal } = process.memoryUsage();

        const embed = new EmbedBuilder()
          .setTitle('Application Stats')
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp()
          .addFields(
            {
              name: 'Memory Usage',
              value: `\`${(heapUsed / 1024 / 1024).toFixed(2)}\` / \`${(heapTotal / 1024 / 1024).toFixed(2)}\` MB`,
              inline: true,
            },
            {
              name: 'Uptime',
              value: `\`${Math.floor(process.uptime() / 60)}\` minutes`,
              inline: true,
            },
            {
              name: 'Shards Count',
              value: `\`${interaction.client.shard?.count}\``,
              inline: true,
            },
            {
              name: 'Current Shard ID',
              value: `\`${interaction.guild?.shardId}\``,
              inline: true,
            },
            {
              name: 'Guilds in Current Shard',
              value: `\`${interaction.client.guilds.cache.size}\``,
              inline: true,
            },
            {
              name: 'Total Guilds',
              value: `\`${totalGuilds}\``,
              inline: true,
            },
            {
              name: 'Total Members',
              value: `\`${totalMembers}\``,
              inline: true,
            },
          );

        return interaction.editReply({ embeds: [embed] });
      })
      .catch((err) => {
        logger.error('There was an error while fetching stats.', err);
        return interaction.editReply(
          'There was an error while fetching stats.',
        );
      });
  }
}
