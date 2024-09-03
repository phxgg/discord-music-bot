import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  GuildTextBasedChannel,
  InteractionCollector,
  Message,
} from 'discord.js';
import { GuildQueue, QueueRepeatMode } from 'discord-player';

import { appConfig } from '../config/appConfig';
import inSameVoiceChannel from '../middleware/inSameVoiceChannel';
import { MessageType } from '../types/MessageType';
import { createEmbedMessage, parseError } from './funcs';
import logger from './logger';

const UPDATE_MESSAGE_INTERVAL = 10000; // in milliseconds
const COLLECTOR_EXTRA_TIME = 10000;

function getLoopModeName(value: QueueRepeatMode): string {
  switch (value) {
    case QueueRepeatMode.OFF:
      return 'Off';
    case QueueRepeatMode.TRACK:
      return 'Track';
    case QueueRepeatMode.QUEUE:
      return 'Queue';
    case QueueRepeatMode.AUTOPLAY:
      return 'Autoplay';
    default:
      return 'Unknown';
  }
}

export default class TrackBox {
  updateMessageInterval: NodeJS.Timeout | null = null;
  resetCollectorTimerInterval: NodeJS.Timeout | null = null;
  collector: InteractionCollector<ButtonInteraction> | null = null;
  channel: GuildTextBasedChannel;
  queue: GuildQueue;
  message: Message | null = null;
  row = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
  // secondRow = new ActionRowBuilder().addComponents(
  //   new ButtonBuilder()
  //     .setCustomId('stop')
  //     .setLabel('⏹')
  //     .setStyle(ButtonStyle.Danger),
  // );

  constructor({
    channel,
    queue,
  }: {
    channel: GuildTextBasedChannel;
    queue: GuildQueue;
  }) {
    if (!channel || !queue) {
      throw new TypeError('TrackBox constructor data cannot be empty.');
    }
    this.channel = channel;
    this.queue = queue;
  }

  /**
   * This method should be called when the player gets paused.
   * This method will keep resetting the component collector timer so that the it won't time out when the player is paused.
   * If this method is not called, the component collector will be timed out and the buttons will be disabled.
   */
  public async playerPause(): Promise<void> {
    this.updatePauseButton();
    await this.updateMessageComponents();

    if (this.resetCollectorTimerInterval) {
      clearInterval(this.resetCollectorTimerInterval);
      this.resetCollectorTimerInterval = null;
    }

    const time =
      (this.queue.currentTrack?.durationMS || 0) + COLLECTOR_EXTRA_TIME;
    const resetTimer = () => this.collector?.resetTimer({ time: time });
    // immediately reset the timer
    resetTimer();
    // reset the timer every x seconds
    this.resetCollectorTimerInterval = setInterval(resetTimer, time - 1000);
  }

  /**
   * This method should be called when the player gets resumed.
   * This method will reset things that were set by the playerPause() method.
   */
  public async playerResume(): Promise<void> {
    this.updatePauseButton();
    await this.updateMessageComponents();

    if (this.resetCollectorTimerInterval) {
      clearInterval(this.resetCollectorTimerInterval);
      this.resetCollectorTimerInterval = null;
    }
    const time =
      (this.queue.currentTrack?.durationMS || 0) + COLLECTOR_EXTRA_TIME;
    const resetTimer = () => this.collector?.resetTimer({ time: time });
    // immediately reset the timer
    resetTimer();
  }

  private enableButtons() {
    this.row.components.forEach((component) => component.setDisabled(false));
    // this.secondRow.components.forEach((component) => component.setDisabled(false));
  }

  private disableButtons() {
    this.row.components.forEach((component) => component.setDisabled(true));
    // this.secondRow.components.forEach((component) => component.setDisabled(true));
  }

  private updatePauseButton() {
    this.row.components
      .filter((component) => (component.data as any).custom_id === 'pause')[0]
      .setLabel(this.queue.node.isPaused() ? '⏵' : '⏸')
      .setStyle(
        this.queue.node.isPaused()
          ? ButtonStyle.Primary
          : ButtonStyle.Secondary,
      );
  }

  /**
   * Updates the message components.
   */
  private async updateMessageComponents(): Promise<void> {
    if (this.message) {
      try {
        await this.message.edit({
          components: [this.row], // , this.secondRow
        });
      } catch (err) {
        logger.error(
          `updateMessageComponents() -> ${this.queue.guild.id}`,
          err,
        );
      }
    }
  }

  /**
   * Updates the trackbox message.
   */
  private async updateMessage(): Promise<void> {
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

  private buildTrackBoxEmbed(): EmbedBuilder {
    if (!this.queue) {
      throw new TypeError('buildTrackBoxEmbed() -> queue cannot be empty.');
    }

    let progressBar;
    try {
      progressBar = '```' + this.queue.node.createProgressBar() + '```';
    } catch (err) {
      progressBar = '```An error occurred while creating the progress bar.```';
      logger.error(`buildTrackBoxEmbed() -> ${this.queue.guild.id}`, err);
    }

    return new EmbedBuilder()
      .setAuthor({
        name: 'Now Playing',
      })
      .setTitle(
        `${this.queue.currentTrack?.author} - ${this.queue.currentTrack?.title}`,
      )
      .setURL(this.queue.currentTrack?.url || '')
      .setDescription(progressBar)
      .setThumbnail(this.queue.currentTrack?.thumbnail || '')
      .addFields(
        {
          name: 'Link',
          value: `[Click](${this.queue.currentTrack?.url})`,
          inline: true,
        },
        {
          name: 'Duration',
          value: `${this.queue.currentTrack?.duration}`,
          inline: true,
        },
        {
          name: 'In Queue',
          value: `${this.queue.tracks.size} tracks`,
          inline: true,
        },
        {
          name: 'Requested by',
          value: `<@${this.queue.currentTrack?.requestedBy?.id}>`,
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
   */
  public async start(): Promise<void> {
    await this.destroy();
    this.updatePauseButton();
    this.enableButtons();

    this.message = await this.channel.send({
      embeds: [this.buildTrackBoxEmbed()],
      components: [this.row], // , this.secondRow
      // fetchReply: true, // TODO: fix types to have this enabled
    });

    // Update message each 10 seconds.
    this.updateMessageInterval = setInterval(
      () => this.updateMessage(),
      UPDATE_MESSAGE_INTERVAL,
    );

    this.collector = this.message.createMessageComponentCollector({
      time: (this.queue.currentTrack?.durationMS || 0) + COLLECTOR_EXTRA_TIME,
      componentType: ComponentType.Button,
    });
    this.collector.on('collect', (i) => this.onClicked(i));
    this.collector.on('end', () => this.onEnd());
  }

  /**
   * Listener for when a button is clicked.
   */
  private async onClicked(interaction: ButtonInteraction) {
    // run the inSameVoiceChannel middleware
    if (!(await inSameVoiceChannel(interaction))) {
      return;
    }

    if (interaction.customId === 'previous') {
      if (!this.queue) {
        // If the queue is empty, do nothing
        // We can use ButtonInteraction.deferUpdate() here.
        // This will not show "This interaction failed", it replies with saying that you will edit it later,
        // even though we do not have to edit it later.
        interaction.deferUpdate();
        return;
      }

      await this.queue.history
        .previous()
        .then(async () => {
          interaction.update({
            components: [],
            embeds: [],
            content: 'Going back...',
          });
        })
        .catch(async (err) => {
          // do nothing on the trackbox message
          interaction.deferUpdate();
          // send a message to the channel
          if (interaction.channel?.type === ChannelType.GuildText) {
            interaction.channel.send(
              createEmbedMessage(
                MessageType.Warning,
                `<@${interaction.user.id}> ` +
                  (parseError(err) || 'An error occurred!'),
              ),
            );
          }
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
        await interaction.update({
          components: [],
          embeds: [],
          content: 'Skipping...',
        });
      }
    } else if (interaction.customId === 'shuffle') {
      interaction.deferUpdate();
      if (this.queue) {
        this.queue.tracks.shuffle();
        if (interaction.channel?.type === ChannelType.GuildText) {
          await interaction.channel?.send(
            createEmbedMessage(
              MessageType.Info,
              `<@${interaction.user.id}> Shuffled the queue.`,
            ),
          );
        }
      }
    } else if (interaction.customId === 'stop') {
      if (this.queue) {
        this.queue.delete(); // this will emit the queueDelete event which will call trackbox.destroy()
      }
    }
  }

  /**
   * Deletes the trackbox message and stops the collector.
   */
  public async destroy(): Promise<void> {
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
   */
  private async onEnd(): Promise<void> {
    this.disableButtons();
    await this.updateMessageComponents();
    this.collector = null;
  }
}
