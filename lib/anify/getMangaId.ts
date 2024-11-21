import axios, { AxiosResponse } from "axios";

interface Manga {
  id: string;
  title: string;
}

interface SearchResult {
  results: Manga[];
}

export async function fetchInfo(
  romaji: string,
  english: string,
  native: string
): Promise<{ id: string } | null> {
  try {
    const { data: getManga }: AxiosResponse<SearchResult> = await axios.get(
      `https://consumet.animeabyss.to/manga/mangadex/${
        english || romaji
      }`
    );
    
    const findManga = getManga?.results?.find(
    (manga) =>
        manga.title.toLowerCase().includes(romaji.toLowerCase()) ||
        manga.title.toLowerCase().includes(english.toLowerCase()) ||
        manga.title.toLowerCase().includes(native.toLowerCase())
    );


    if (!findManga) {
      return null;
    }

    return { id: findManga.id };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function getMangaId(
  romaji: string,
  english: string,
  native: string
): Promise<{ id: string } | { message: string } | { error: any }> {
  try {
    const data = await fetchInfo(romaji, english, native);

    if (data && "id" in data) {
      return data;
    } else {
      return { message: "Schedule not found" };
    }
  } catch (error) {
    return { error };
  }
}
