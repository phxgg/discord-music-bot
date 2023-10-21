const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} = require('discord.js');
const MessageType = require('../types/MessageType');
const createEmbedMessage = require('./createEmbedMessage');
const { QueueRepeatMode, GuildQueueEvent } = require('discord-player');
const appConfig = require('../config/appConfig');
const logger = require('../utils/logger');
const { parseError } = require('./funcs');
const inSameVoiceChannel = require('../middleware/inSameVoiceChannel');

const UPDATE_MESSAGE_INTERVAL = 10000; // in milliseconds
const COLLECTOR_EXTRA_TIME = 10000;

const getLoopModeName = (value) => {
  const indexOfN = Object.values(QueueRepeatMode).indexOf(value);
  const key = Object.keys(QueueRepeatMode)[indexOfN];
  return key;
};

module.exports = class TrackBox {
  /**
   * 
   * @param {object} options 
   * @param {import('discord.js').TextChannel} options.channel The channel where the trackbox will be sent.
   * @param {import('discord-player').GuildQueue} options.queue The player queue.
   */
  constructor({ channel, queue }) {
    if (!channel || !queue) {
      throw new TypeError('TrackBox constructor data cannot be empty.');
    }

    this.updateMessageInterval = null;
    this.resetCollectorTimerInterval = null;
    /**
     * @type {import('discord.js').InteractionCollector} The component collector.
     */
    this.collector = null;
    this.channel = channel;
    this.queue = queue;
    /**
     * @type {import('discord.js').Message} The message that will display the trackbox embed.
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
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('⏹')
        .setStyle(ButtonStyle.Danger),
    );
    // this.secondRow = new ActionRowBuilder().addComponents(
    //   new ButtonBuilder()
    //     .setCustomId('stop')
    //     .setLabel('⏹')
    //     .setStyle(ButtonStyle.Danger),
    // );
  }

  /**
   * This method should be called when the player gets paused.
   * This method will keep resetting the component collector timer so that the it won't time out when the player is paused.
   * If this method is not called, the component collector will be timed out and the buttons will be disabled.
   * @returns {Promise<void>}
   */
  async playerPause() {
    this.updatePauseButton();
    await this.updateMessageComponents();

    if (this.resetCollectorTimerInterval) {
      clearInterval(this.resetCollectorTimerInterval);
      this.resetCollectorTimerInterval = null;
    }

    const time = this.queue.currentTrack.durationMS + COLLECTOR_EXTRA_TIME;
    const resetTimer = () => this.collector.resetTimer({ time: time });
    // immediately reset the timer
    resetTimer();
    // reset the timer every x seconds
    this.resetCollectorTimerInterval = setInterval(resetTimer, time - 1000);
  }

  /**
   * This method should be called when the player gets resumed.
   * This method will reset things that were set by the playerPause() method.
   * @returns {Promise<void>}
   */
  async playerResume() {
    this.updatePauseButton();
    await this.updateMessageComponents();

    if (this.resetCollectorTimerInterval) {
      clearInterval(this.resetCollectorTimerInterval);
      this.resetCollectorTimerInterval = null;
    }
    const time = this.queue.currentTrack.durationMS + COLLECTOR_EXTRA_TIME;
    const resetTimer = () => this.collector.resetTimer({ time: time });
    // immediately reset the timer
    resetTimer();
  }

  enableButtons() {
    this.row.components.forEach((component) => component.setDisabled(false));
    // this.secondRow.components.forEach((component) => component.setDisabled(false));
  }

  disableButtons() {
    this.row.components.forEach((component) => component.setDisabled(true));
    // this.secondRow.components.forEach((component) => component.setDisabled(true));
  }

  updatePauseButton() {
    this.row.components.filter((component) => component.data.custom_id === 'pause')[0]
      .setLabel(this.queue.node.isPaused() ? '⏵' : '⏸')
      .setStyle(this.queue.node.isPaused() ? ButtonStyle.Primary : ButtonStyle.Secondary);
  }

  async updateMessageComponents() {
    if (this.message) {
      try {
        await this.message.edit({
          components: [this.row], // , this.secondRow
        });
      } catch (err) {
        logger.error(`updateMessageComponents() -> ${this.queue.guild.id}`, err);
      }
    }
  }

  async updateMessage() {
    if (this.message) {
      try {
        this.updatePauseButton();
        const embed = this.buildTrackBoxEmbed();
        await this.message.edit({
          embeds: [embed],
          components: [this.row], // , this.secondRow
        });
      } catch (err) {
        logger.error(`updateMessage() -> ${this.queue.guild.id}`, err);
      }
    }
  }

  buildTrackBoxEmbed() {
    if (!this.queue) {
      throw new TypeError('buildTrackBoxEmbed() -> queue cannot be empty.');
    }

    const progressBar = '```' + this.queue.node.createProgressBar() + '```';
    return new EmbedBuilder()
      .setAuthor({
        name: 'Now Playing',
      })
      .setTitle(`${this.queue.currentTrack.author} - ${this.queue.currentTrack.title}`)
      .setURL(this.queue.currentTrack.url)
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
        {
          name: 'Requested by',
          value: `<@${this.queue.currentTrack.requestedBy.id}>`,
          inline: true,
        },
        {
          name: 'Volume',
          value: `${this.queue.node.volume}%`,
          inline: true,
        },
        {
          name: 'Loop',
          value: `\`${getLoopModeName(this.queue.repeatMode)}\``,
          inline: true,
        },
      )
      .setFooter({ text: appConfig.name })
      .setColor(MessageType.TrackBox);
  }

  /**
   * Starts the trackbox.
   * @returns {Promise<void>}
   */
  async start() {
    await this.destroy();
    this.updatePauseButton();
    this.enableButtons();

    const trackBoxMessage = await this.channel.send({
      embeds: [this.buildTrackBoxEmbed()],
      components: [this.row], // , this.secondRow
      fetchReply: true,
    });
    this.message = trackBoxMessage;

    // Update message each 10 seconds.
    this.updateMessageInterval = setInterval(() => this.updateMessage(), UPDATE_MESSAGE_INTERVAL);

    this.collector = this.message.createMessageComponentCollector({
      time: this.queue.currentTrack.durationMS + COLLECTOR_EXTRA_TIME,
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
    // run the inSameVoiceChannel middleware
    if (!(await inSameVoiceChannel(interaction))) {
      return;
    }

    if (interaction.customId === 'previous') {
      if (!this.queue) {
        return interaction.deferUpdate();
      }

      await this.queue.history.previous().then(async () => {
        interaction.update({ components: [], embeds: [], content: 'Going back...' });
      }).catch(async (err) => {
        interaction.deferUpdate();
        interaction.channel.send(createEmbedMessage(MessageType.Warning, `<@${interaction.user.id}> ` + (parseError(err) || 'An error occurred!')));
      });
    } else if (interaction.customId === 'pause') {
      if (this.queue) {
        // this.collector.resetTimer({ time: this.queue.currentTrack.durationMS + 30000 });
        this.queue.node.setPaused(!this.queue.node.isPaused());
      }
      this.updatePauseButton();
      await interaction.update({ components: [this.row] }); // , this.secondRow
    } else if (interaction.customId === 'next') {
      if (!this.queue || !this.queue.node.skip()) {
        interaction.deferUpdate();
      } else {
        await interaction.update({ components: [], embeds: [], content: 'Skipping...' });
      }
    } else if (interaction.customId === 'shuffle') {
      interaction.deferUpdate();
      if (this.queue) {
        this.queue.tracks.shuffle();
        await interaction.channel.send(createEmbedMessage(MessageType.Info, `<@${interaction.user.id}> Shuffled the queue.`));
      }
    } else if (interaction.customId === 'stop') {
      if (this.queue) {
        this.queue.delete(); // this will emit the queueDelete event which will call trackbox.destroy()
      }
    }
  }

  async destroy() {
    try {
      if (this.message) {
        await this.message.delete();
        // set this.message to null before we stop the collector for performance reasons.
        // If we don't do this, the collector will try to update the message components when it's unnecessary.
        this.message = null;
      }

      if (this.updateMessageInterval) {
        clearInterval(this.updateMessageInterval);
      }

      if (this.collector) {
        this.collector.stop();
      }
    } catch (err) {
      logger.error(`destroy() -> ${this.queue.guild.id}`, err);
    } finally {
      // no need to set this.collector to null
      // because it will be set to null in the onEnd() method
      // after we call this.collector.stop()

      this.updateMessageInterval = null;
      this.message = null;
    }
  }

  /**
   * Listener for when the collector ends.
   * @returns {Promise<void>}
   */
  async onEnd() {
    this.disableButtons();
    await this.updateMessageComponents();
    this.collector = null;
  }
};
