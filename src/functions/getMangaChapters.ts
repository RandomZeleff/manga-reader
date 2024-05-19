import { load } from "cheerio";
import getHTML from "./getHTML";

const getMangaChapters = async (url: string) => {
  const html = await getHTML(url);
  const $ = load(html);

  const form = $("#header-image form");
  const selectPages = form.children().first();

  const pages: SelectResult[] = [];

  selectPages.find("option").map((i, el) => {
    pages.push({
      name: $(el).text(),
      value: $(el).attr("value") as string,
    });
  });

  return pages;
};

getMangaChapters("https://lelscans.net/lecture-ligne-tokyo-shinobi-squad.php");

export default getMangaChapters;
