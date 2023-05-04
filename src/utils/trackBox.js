const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Colors,
}
  = require('discord.js');

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
        .setLabel('⏯')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('⏭')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('shuffle')
        .setLabel('🔀')
        .setStyle(ButtonStyle.Success),
    );
    this.stopRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('⏹')
        .setStyle(ButtonStyle.Danger),
    );
  }

  updateComponents() {
    this.row.components.filter((component) => component.data.custom_id === 'pause')[0]
      .setStyle(this.queue.node.isPaused() ? ButtonStyle.Success : ButtonStyle.Primary);
  }

  /**
   * Starts the trackbox.
   * @returns {Promise<import('discord.js').Message>}
   */
  async start() {
    if (this.collector) {
      this.collector.stop();
    }

    if (!this.queue || !this.queue.isPlaying()) {
      if (this.message) {
        await this.message.delete();
      }
    }

    const trackBox = new EmbedBuilder()
      .setTitle('Now Playing')
      .setDescription(`[${this.queue.currentTrack.title}](${this.queue.currentTrack.url})`)
      .setThumbnail(this.queue.currentTrack.thumbnail)
      .setFooter({ text: 'TrackBox' })
      .setColor(Colors.Purple);

    if (this.message) {
      try {
        await this.message.delete();
      } catch (err) {
        console.log(err);
      }
    }

    const trackBoxMessage = await this.channel.send({
      embeds: [trackBox],
      components: [this.row, this.stopRow],
      fetchReply: true,
    });
    this.message = trackBoxMessage;

    // const filter = (i) => {
    //   return i.user.id === interaction.user.id;
    // };
    this.collector = this.message.createMessageComponentCollector({
      // filter,
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
      this.updateComponents();
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
      }
    } else if (interaction.customId === 'stop') {
      if (this.queue) {
        this.queue.delete(); // this will emit the emptyQueue event which will destroy the trackbox
      }
    }
  }

  async destroy() {
    try {
      if (this.collector) {
        this.collector.stop();
      }

      if (this.message) {
        await this.message.delete();
      }
      this.message = null;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Listener for when the collector ends.
   * @returns {Promise<void>}
   */
  async onEnd() {
    console.log('TrackBox collector ended.');

    // this.row.components.forEach((component) => component.setDisabled(true));
    // if (this.message) {
    //   await this.message.delete();
    // }
    // this.message = null;
  }
};
