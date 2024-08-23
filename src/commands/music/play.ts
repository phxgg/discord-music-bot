import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { MessageType } from '../../types/MessageType';
import { createEmbedMessage } from '../../utils/funcs';
import logger from '../../utils/logger';
import { parseError } from '../../utils/funcs';
import inVoiceChannel from '../../middleware/inVoiceChannel';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a track.')
    .addStringOption(option => option.setName('query').setDescription('The song to play').setRequired(true)),
  middleware: [inVoiceChannel],
  async execute(interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();
    if (!player) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'Player is not ready.'));
    }

    const member = interaction.member as GuildMember | null;
    const channel = member?.voice.channel;
    if (!channel) {
      return interaction.reply(createEmbedMessage(MessageType.Warning, 'You need to be in a voice channel to play music!'));
    }
    const query = interaction.options.getString('query', true); // we need input/query to play

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();
    try {
      const { track } = await player.play(channel, query, {
        nodeOptions: {
          // nodeOptions are the options for guild node (aka your queue in simple word)
          metadata: interaction, // we can access this metadata object using queue.metadata later on
        },
        requestedBy: interaction.user, // who requested the track
      });

      return interaction.followUp(createEmbedMessage(MessageType.Info, `**${track.title}** enqueued!`));
    } catch (err) {
      logger.error(`${interaction.guild!.id} -> ${err}`);
      return interaction.followUp(createEmbedMessage(MessageType.Error, `Something went wrong: ${parseError(err)}`));
    }
  },
};
