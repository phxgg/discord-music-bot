const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Colors,
}
  = require('discord.js');
const MessageType = require('../types/MessageType');
const createEmbedMessage = require('./createEmbedMessage');

module.exports = class TrackBox {
  /**
   * 
   * @param {object} options 
   * @param {import('discord.js').TextChannel} options.channel 
   * @param {import('discord-player').GuildQueue} options.queue 
   */
  constructor({ channel, queue }) {
    if (!channel || !queue) {
      throw new TypeError('TrackBox constructor data cannot be empty.');
    }

    this.updateProgressBarInterval = null;
    this.collector = null;
    this.channel = channel;
    this.queue = queue;
    /**
     * @type {import('discord.js').Message}
     */
    this.message = null;
    this.row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('previous')
        .setDisabled(true)
        .setLabel('⏮')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('pause')
        .setLabel('⏸')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('⏭')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('shuffle')
        .setLabel('🔀')
        .setStyle(ButtonStyle.Secondary),
    );
    this.stopRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('backward30')
        .setLabel('Backward 30s')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('forward30')
        .setLabel('Forward 30s')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('⏹')
        .setStyle(ButtonStyle.Danger),
    );
  }

  updatePauseButton() {
    this.row.components.filter((component) => component.data.custom_id === 'pause')[0]
      .setLabel(this.queue.node.isPaused() ? '⏵' : '⏸')
      .setStyle(this.queue.node.isPaused() ? ButtonStyle.Primary : ButtonStyle.Secondary);
  }

  setButtonDisabled(customId, disabled) {
    this.row.components.filter((component) => component.data.custom_id === customId)[0]
      .setDisabled(disabled);
  }

  updateProgressBar() {
    if (this.message) {
      try {
        this.message.edit({
          embeds: [this.buildTrackBoxEmbed()],
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  buildTrackBoxEmbed() {
    const progressBar = '```' + this.queue.node.createProgressBar() + '```';
    return new EmbedBuilder()
      .setTitle(`Now Playing: ${this.queue.currentTrack.author} - ${this.queue.currentTrack.title}`)
      .setDescription(progressBar)
      .setThumbnail(this.queue.currentTrack.thumbnail)
      .addFields(
        {
          name: 'Link',
          value: `[Click](${this.queue.currentTrack.url})`,
          inline: true,
        },
        {
          name: 'Duration',
          value: `${this.queue.currentTrack.duration}`,
          inline: true,
        },
        {
          name: 'In Queue',
          value: `${this.queue.tracks.size} tracks`,
          inline: true,
        },
      )
      .setFooter({ text: 'Discord Music Bot' })
      .setColor(Colors.Purple);
  }

  /**
   * Starts the trackbox.
   * @returns {Promise<import('discord.js').Message>}
   */
  async start() {
    await this.destroy();
    this.updatePauseButton();

    if (this.message) {
      try {
        await this.message.delete();
      } catch (err) {
        console.log(err);
      }
    }

    const trackBoxMessage = await this.channel.send({
      embeds: [this.buildTrackBoxEmbed()],
      components: [this.row, this.stopRow],
      fetchReply: true,
    });
    this.message = trackBoxMessage;

    // Update progress bar each 10 seconds.
    this.updateProgressBarInterval = setInterval(() => this.updateProgressBar(), 10000);

    this.collector = this.message.createMessageComponentCollector({
      time: this.queue.currentTrack.durationMS + 30000,
      componentType: ComponentType.Button,
    });
    this.collector.on('collect', (i) => this.onClicked(i));
    this.collector.on('end', () => this.onEnd());
  }

  /**
   * Listener for when a button is clicked.
   * @param {import('discord.js').ButtonInteraction} interaction
   * @returns {Promise<void>}
   */
  async onClicked(interaction) {
    if (interaction.customId === 'pause') {
      if (this.queue) {
        // this.collector.resetTimer({ time: this.queue.currentTrack.durationMS + 30000 });
        this.queue.node.setPaused(!this.queue.node.isPaused());
      }
      this.updatePauseButton();
      await interaction.update({ components: [this.row, this.stopRow] });
      // await interaction.update(this.getPage(this.currentPage - 1));
    } else if (interaction.customId === 'next') {
      interaction.deferUpdate();
      if (this.queue) {
        this.queue.node.skip();
      }
    } else if (interaction.customId === 'shuffle') {
      interaction.deferUpdate();
      if (this.queue) {
        this.queue.tracks.shuffle();
        await interaction.channel.send(createEmbedMessage(MessageType.Info, `<@${interaction.user.id}> Shuffled the queue.`));
      }
    }
    // TODO: Implement 30 seconds backwards and forwards buttons.
    else if (interaction.customId === 'backward30') {
      interaction.deferUpdate();
      if (this.queue) {
        // this.queue.node.seek(this.queue.node.playbackTime - 30000);
      }
    } else if (interaction.customId === 'forward30') {
      interaction.deferUpdate();
      if (this.queue) {
        // this.queue.node.seek(this.queue.node.playbackTime + 30000);
      }
    } else if (interaction.customId === 'stop') {
      if (this.queue) {
        this.queue.delete(); // this will emit the emptyQueue event which will call trackbox.destroy()
      }
    }
  }

  async destroy() {
    try {
      if (this.updateProgressBarInterval) {
        clearInterval(this.updateProgressBarInterval);
      }

      if (this.collector) {
        this.collector.stop();
      }

      if (this.message) {
        await this.message.delete();
      }
    } catch (err) {
      console.error(err);
    } finally {
      // no need to set this.collector to null
      // because it will be set to null in the onEnd() method
      // after we call this.collector.stop()

      this.updateProgressBarInterval = null;
      this.message = null;
    }
  }

  /**
   * Listener for when the collector ends.
   * @returns {Promise<void>}
   */
  async onEnd() {
    console.log('TrackBox collector ended.');
    this.collector = null;
  }
};
