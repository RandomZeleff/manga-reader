import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
} from "discord.js";
import getMangaUrl from "./functions/getManga";
import getAllMangas from "./functions/getAllMangas";
import getMangaPages from "./functions/getMangaPages";
import Pagination from "./lib/Pagination";

const client = new Client({ intents: 327679 });

client.once("ready", () =>
  console.log(`Connecté en tant que ${client.user?.username}!`)
);

client.on("messageCreate", async (message) => {
  const args = message.content.split(" ");

  if (args[0] === ".search") {
    const msg = await message.reply({
      content: `Recherche d'anime en cours..`,
    });

    const animeName = args.slice(1).join(" ");
    const manga = await getMangaUrl(animeName);

    if (!manga) {
      const mangas = await getAllMangas();
      await msg.edit({
        content: `**Manga non pris en charge.**\n\n${mangas
          .map((manga) => manga.name)
          .join("\n")}`,
      });
      return;
    }
  }

  if (args[0] === ".pages") {
    const msg = await message.reply({
      content: "Recherche de pages en cours..",
    });

    const chapter = Number(args[1]);
    if (!chapter) {
      await msg.reply({ content: "Le chapitre doit être un nombre." });
      return;
    }

    const animeName = args.slice(2).join(" ");
    const manga = await getMangaUrl(animeName);

    if (!manga) {
      const mangas = await getAllMangas();
      await msg.edit({
        content: `**Manga non pris en charge.**\n\n${mangas
          .map((manga) => manga.name)
          .join("\n")}`,
      });
      return;
    }

    const pages = await getMangaPages(manga, chapter);
    if (pages.length) {
      const embeds = new Pagination(
        pages.map((page, i) =>
          new EmbedBuilder()
            .setDescription(`Chapitre ${chapter} de ${manga.name}.`)
            .setImage(page)
            .setFooter({ text: `page ${i + 1} / ${pages.length + 1}` })
        )
      );
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("<")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel(">")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setURL(
            `https://lelscans.net/scan-${manga.name
              .toLowerCase()
              .replace(" ", "-")}/${chapter}`
          )
          .setLabel("Ouvrir")
          .setStyle(ButtonStyle.Link)
      );

      await message.reply({
        embeds: [embeds.current()],
        components: [row],
      });

      const collector = message.channel.createMessageComponentCollector({
        filter: (i) => i.user.id === message.author.id,
        time: 30 * 60_000,
      });

      collector.on("collect", async (collect) => {
        if (collect.customId === "previous")
          await collect.update({ embeds: [embeds.previous()] });
        else if (collect.customId === "next")
          await collect.update({ embeds: [embeds.next()] });
      });
    }
  }
});

client.login("DISCORD_CLIENT_TOKEN");
