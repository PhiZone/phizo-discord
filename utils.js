const { EmbedBuilder } = require('discord.js');

const convertTime = (input, round = false) => {
  let minutes = 0,
    seconds = 0;

  if (typeof input === 'string') {
    const list = input.split(':');
    const hasHour = list.length > 2;
    const hours = hasHour ? parseInt(list[0]) : 0;
    minutes = parseInt(list[hasHour ? 1 : 0]) + hours * 60;
    seconds = parseFloat(list[hasHour ? 2 : 1]);
  } else if (typeof input === 'number') {
    minutes = Math.floor(input / 60);
    seconds = input % 60;
  }

  return `${minutes.toString().padStart(2, '0')}:${
    round
      ? Math.round(seconds).toString().padStart(2, '0')
      : seconds.toFixed(2).padStart(5, '0')
  }`;
};

module.exports = {
  log: (message, ...optionalParams) =>
    console.log(
      `\x1b[2m${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\x1b[0m`,
      message,
      ...optionalParams,
    ),
  warn: (message, ...optionalParams) =>
    console.warn(
      `\x1b[2m${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\x1b[0m`,
      message,
      ...optionalParams,
    ),
  error: (message, ...optionalParams) =>
    console.error(
      `\x1b[2m${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\x1b[0m`,
      message,
      ...optionalParams,
    ),
  recordToEmbed: (record, description) =>
    record
      ? new EmbedBuilder()
        .setColor(
          record.score === 100_0000
            ? 0xeffc8f
            : record.bad + record.miss === 0
              ? 0x98e9fc
              : 0xf8f8f2,
        )
        .setTitle(
          `${record.chart.title ?? record.chart.song.title} [${
            record.chart.level
          } ${Math.floor(record.chart.difficulty)}]`,
        )
        .setURL(`${process.env.WEBSITE_URL}/records/${record.id}`)
        .setAuthor({
          name: record.owner.userName,
          iconURL: record.owner.avatar,
          url: `${process.env.WEBSITE_URL}/users/${record.ownerId}`,
        })
        .setDescription(description)
        .setThumbnail(
          record.chart.illustration ?? record.chart.song.illustration,
        )
        .addFields(
          { name: 'Score', value: record.score.toString(), inline: true },
          {
            name: 'Accuracy',
            value: `${(record.accuracy * 100).toFixed(2)}%`,
            inline: true,
          },
          { name: 'RKS', value: record.rks.toFixed(3), inline: true },
        )
        .setTimestamp(new Date(record.dateCreated))
      : new EmbedBuilder().setTitle('EMPTY').setDescription(description),
  chartToEmbed: (chart) =>
    new EmbedBuilder()
      .setColor(
        chart.levelType === 0
          ? 0x98e9fc
          : chart.levelType === 1
            ? 0xeffc8f
            : chart.levelType === 2
              ? 0xf872c6
              : chart.levelType === 3
                ? 0x242530
                : 0xf9b96f,
      )
      .setTitle(
        `${chart.title ?? chart.song.title} [${chart.level} ${Math.floor(
          chart.difficulty,
        )}]`,
      )
      .setURL(`${process.env.WEBSITE_URL}/charts/${chart.id}`)
      .setAuthor({
        name: chart.authorName.replace(
          /\[PZUser:\d+:([^\]]+?)(:PZRT)?\]/g,
          '$1',
        ),
        url: `${process.env.WEBSITE_URL}/users/${chart.ownerId}`,
      })
      .setImage(chart.illustration ?? chart.song.illustration)
      .addFields(
        {
          name: 'Difficulty',
          value: chart.difficulty.toFixed(1),
          inline: true,
        },
        { name: 'Note Count', value: chart.noteCount.toString(), inline: true },
        {
          name: 'Rating',
          value: `${chart.rating.toFixed(2)} / 5.00`,
          inline: true,
        },
      )
      .setTimestamp(new Date(chart.dateCreated)),
  songToEmbed: (song) =>
    new EmbedBuilder()
      .setColor(song.isOriginal ? 0xeffc8f : 0xf8f8f2)
      .setTitle(song.edition ? `${song.title} (${song.edition})` : song.title)
      .setURL(`${process.env.WEBSITE_URL}/songs/${song.id}`)
      .setAuthor({
        name: song.authorName.replace(
          /\[PZUser:\d+:([^\]]+?)(:PZRT)?\]/g,
          '$1',
        ),
        url: song.isOriginal
          ? `${process.env.WEBSITE_URL}/users/${song.ownerId}`
          : undefined,
      })
      .setImage(song.illustration)
      .addFields(
        { name: 'Illustrator', value: song.illustrator, inline: true },
        {
          name: 'BPM',
          value:
            song.minBpm === song.maxBpm
              ? song.bpm.toString()
              : `${song.minBpm} ~ ${song.maxBpm} (${song.bpm})`,
          inline: true,
        },
        { name: 'Duration', value: convertTime(song.duration), inline: true },
      )
      .setTimestamp(new Date(song.dateCreated)),
};
