import { Character } from "@/domain/models";
import { LoadCharacters } from "@/domain/features";
import { HttpClient } from "@/data/contracts";

export class RemoteLoadCharacters implements LoadCharacters {
  constructor(private readonly httpClient: HttpClient) {}

  async loadAll(page: number = 1, limit: number = 50): Promise<Character[]> {
    console.log("page", page);
    console.log("limit", limit);
    
    const result = await this.httpClient.request("/characters", "get", {
      params: {
        offset: (page - 1) * limit,
        limit,
      },
    });

    return this.mapDataToModel(result.data.data.results);
  }

  private mapDataToModel(characters: any[]): Character[] {
    return characters.map((character) => ({
      id: character.id,
      name: character.name,
      description: character.description,
      resourceURI: character.resourceURI,
      thumbnail: character.thumbnail.path.includes("image_not_available")
        ? "https://midias.correiobraziliense.com.br/_midias/jpg/2021/05/03/675x450/1_marvel_studios_logo-6637962.jpeg?20220621151438?20220621151438"
        : `${character.thumbnail.path}.${character.thumbnail.extension}`,
    }));
  }
}
