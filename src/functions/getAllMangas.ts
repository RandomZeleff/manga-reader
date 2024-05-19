import { load } from "cheerio";
import getHTML from "./getHTML";

const getAllMangas = async () => {
  const html = await getHTML();
  const $ = load(html);

  const form = $("#header-image form");
  const selectMangas = form.children().last();

  const mangas: SelectResult[] = [];

  selectMangas.find("option").map((i, el) => {
    mangas.push({
      name: $(el).text(),
      value: $(el).attr("value") as string,
    });
  });

  return mangas;
};

export default getAllMangas;
