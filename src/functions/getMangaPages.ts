import { load } from "cheerio";
import getHTML from "./getHTML";
import getMangaChapters from "./getMangaChapters";

const BASE_URL = "https://lelscans.net";

const getMangaPages = async (manga: SelectResult, chapterNumber: number) => {
  try {
    const chapters = await getMangaChapters(manga.value);
    const chapter = chapters.find((c) => Number(c.name) === chapterNumber);
    if (!chapter) throw { message: "This chapter not exist.", chapters };

    const chapterName = manga.name.toLowerCase().replace(" ", "-");

    const html = await getHTML(chapter.value);
    if (!html) throw { message: "The page not exist.", html };

    const $ = load(html);
    const navigation = $("#navigation a");
    /**
     * - Remove "Prec" / "Suiv" / "Name of manga" from navigation.
     */
    const pagesLength = navigation.length - 3;
    const pages = Array.from(
      { length: pagesLength },
      (_, index) =>
        `${BASE_URL}/mangas/${chapterName}/${chapterNumber}/${
          index > 9 ? index : `0${index}`
        }.jpg`
    );

    return pages;
  } catch (error) {
    throw error;
  }
};

export default getMangaPages;
