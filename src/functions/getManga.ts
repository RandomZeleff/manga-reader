import getAllMangas from "./getAllMangas";

const getManga = async (name: string) => {
  const mangas = await getAllMangas();
  const manga = mangas.find(
    (manga) => manga.name.toLowerCase() === name.toLowerCase()
  );

  return manga;
};

export default getManga;
