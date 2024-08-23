/* Credits to DankMemer/sniper for this code. */

import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, ComponentType, EmbedBuilder, InteractionCollector, type Embed } from "discord.js";

export default class Paginator {
  data: EmbedBuilder[];
  currentPage: number | null;
  row: ActionRowBuilder<AnyComponentBuilder>;
  stopRow: ActionRowBuilder<AnyComponentBuilder>;

  constructor(data: EmbedBuilder[]) {
    if (!data?.length) {
      throw new TypeError('Paginator data must have at least one value.');
    }

    this.data = data;
    this.currentPage = null; // 0-indexed
    this.row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('first')
        .setLabel('<<')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('<')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('currentPage')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('>')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('last')
        .setLabel('>>')
        .setStyle(ButtonStyle.Primary),
    );
    this.stopRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Danger),
    );
  }

  /**
   * Starts the paginator.
   */
  async start({ interaction, time = 60000 }: {
    interaction: CommandInteraction,
    time?: number,
  }): Promise<void> {
    const message = await interaction.editReply({
      ...this.getPage(0),
      fetchReply: true,
    });

    const filter = (i: CommandInteraction) => {
      return i.user.id === interaction.user.id;
    };
    const collector = message.createMessageComponentCollector({
      time,
      filter,
      componentType: ComponentType.Button,
    });
    collector.on('collect', (i) => this.onClicked(i, collector));
    collector.on('end', () => this.onEnd(interaction));
  }

  /**
   * Listener for when a button is clicked.
   * @param {import('discord.js').ButtonInteraction} interaction
   * @param {import('discord.js').InteractionCollector} collector
   * @returns {Promise<void>}
   */
  async onClicked(interaction: ButtonInteraction, collector: InteractionCollector<ButtonInteraction>): Promise<void> {
    if (interaction.customId === 'first') {
      if (this.currentPage === 0) {
        interaction.deferUpdate();
        return;
      }
      await interaction.update(this.getPage(0));
    } else if (interaction.customId === 'previous') {
      if (this.currentPage === 0) {
        interaction.deferUpdate();
        return;
      }
      await interaction.update(this.getPage(this.currentPage - 1));
    } else if (interaction.customId === 'next') {
      if (this.currentPage === this.data.length - 1) {
        interaction.deferUpdate();
        return;
      }
      await interaction.update(this.getPage(this.currentPage + 1));
    } else if (interaction.customId === 'last') {
      if (this.currentPage === this.data.length - 1) {
        interaction.deferUpdate();
        return;
      }
      await interaction.update(this.getPage(this.data.length - 1));
    } else if (interaction.customId === 'stop') {
      collector.stop();
    }
  }

  /**
   * Listener for when the collector ends.
   */
  async onEnd(interaction: CommandInteraction): Promise<void> {
    this.row.components.forEach((component) => component.setDisabled(true));
    await interaction.editReply({ components: [this.row] });
  }

  /**
   * Gets the send options for a page.
   */
  getPage(number: number) {
    this.currentPage = number;
    this.row.components
      .find((component) => component.data.custom_id === 'currentPage')
      .setLabel(`${number + 1}/${this.data.length}`);
    return { embeds: [this.data[number]], components: [this.row, this.stopRow] };
  }
};
