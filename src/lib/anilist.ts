export interface AniListManga {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
    extraLarge: string;
  };
  averageScore: number;
  format?: string;
  startDate?: {
    year?: number;
  };
  description?: string;
  bannerImage?: string | null;
  genres?: string[];
}

export interface AniListMangaDetail {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  description: string;
  bannerImage: string | null;
  coverImage: {
    large: string;
    extraLarge: string;
  };
  genres: string[];
}

export interface AniListResponse {
  data: {
    Page: {
      media: AniListManga[];
    };
  };
}

export interface AniListDetailResponse {
  data: {
    Media: AniListMangaDetail;
  };
}

export async function fetchTrendingManga(): Promise<AniListManga[]> {
  const query = `
    query {
      Page(page: 1, perPage: 20) {
        media(type: MANGA, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          averageScore
          description
          bannerImage
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.statusText}`);
  }

  const data: AniListResponse = await response.json();
  return data.data.Page.media;
}

export async function fetchPopularManga(): Promise<AniListManga[]> {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(type: MANGA, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          averageScore
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.statusText}`);
  }

  const data: AniListResponse = await response.json();
  return data.data.Page.media;
}

export async function fetchTopRatedManga(): Promise<AniListManga[]> {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(type: MANGA, sort: SCORE_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          averageScore
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.statusText}`);
  }

  const data: AniListResponse = await response.json();
  return data.data.Page.media;
}

export async function fetchRecentlyUpdatedManga(): Promise<AniListManga[]> {
  const query = `
    query {
      Page(page: 1, perPage: 8) {
        media(type: MANGA, sort: UPDATED_AT_DESC, status: RELEASING) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          averageScore
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.statusText}`);
  }

  const data: AniListResponse = await response.json();
  return data.data.Page.media;
}

export async function fetchMangaDetails(id: string | number): Promise<AniListMangaDetail> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        title {
          romaji
          english
        }
        description
        bannerImage
        coverImage {
          large
          extraLarge
        }
        genres
      }
    }
  `;

  const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ 
      query,
      variables: { id: parsedId }
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.statusText}`);
  }

  const data: AniListDetailResponse = await response.json();
  return data.data.Media;
}

export async function searchManga(query: string): Promise<AniListManga[]> {
  const searchQuery = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: MANGA, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          averageScore
          format
          startDate {
            year
          }
          description
          bannerImage
          genres
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
      variables: { search: query }
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.statusText}`);
  }

  const data: AniListResponse = await response.json();
  return data.data.Page.media;
}

export async function fetchFilteredManga(
  genres?: string | string[],
  sort?: string,
  format?: string,
  page: number = 1,
  perPage: number = 24
): Promise<AniListManga[]> {
  // 1. Define lists of known AniList Tags versus official Genres
  const ANILIST_TAGS = ["Harem", "Isekai"];

  // 2. Process genres safely and separate from tags
  const processedGenres = typeof genres === 'string'
    ? genres.split(',').map(g => g.trim()).filter(Boolean)
    : Array.isArray(genres) ? genres.filter(Boolean) : [];

  // 3. Separate them out dynamically
  const cleanGenres = processedGenres.filter(g => !ANILIST_TAGS.includes(g));
  const cleanTags = processedGenres.filter(g => ANILIST_TAGS.includes(g));

  // 4. Map format to country code
  let countryFilter: string | undefined = undefined;
  if (format) {
    const normalized = format.toLowerCase();
    if (normalized === 'manga') countryFilter = 'JP';  // Japan
    if (normalized === 'manhwa') countryFilter = 'KR'; // South Korea (Manhwa)
    if (normalized === 'manhua') countryFilter = 'CN'; // China (Manhua)
  }

  // 5. Map sort parameters to valid AniList MediaSort enums
  let aniListSort = "TRENDING_DESC";
  if (sort === "TRENDING") aniListSort = "TRENDING_DESC";
  if (sort === "POPULARITY") aniListSort = "POPULARITY_DESC";
  if (sort === "UPDATED") aniListSort = "UPDATED_AT_DESC";
  if (sort === "SCORE") aniListSort = "SCORE_DESC";

  // 6. Construct GraphQL variables cleanly
  const variables: Record<string, any> = {
    page: page || 1,
    perPage: perPage || 24,
    sort: [aniListSort]
  };

  // Only add the parameters if elements are actively selected
  if (cleanGenres.length > 0) variables.genre_in = cleanGenres;
  if (cleanTags.length > 0) variables.tag_in = cleanTags;
  if (countryFilter) variables.countryOfOrigin = countryFilter;

  const query = `
    query ($page: Int, $perPage: Int, $genre_in: [String], $tag_in: [String], $sort: [MediaSort], $countryOfOrigin: CountryCode) {
      Page(page: $page, perPage: $perPage) {
        media(type: MANGA, genre_in: $genre_in, tag_in: $tag_in, sort: $sort, countryOfOrigin: $countryOfOrigin) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          averageScore
          format
          startDate {
            year
          }
          description
          bannerImage
          genres
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorJson = await response.json();
      if (errorJson.errors && errorJson.errors[0]) {
        errorMessage = errorJson.errors[0].message;
      }
    } catch (e) {
      // Fallback if response isn't JSON
    }
    throw new Error(`AniList API error: ${errorMessage}`);
  }

  const data: AniListResponse = await response.json();
  return data.data.Page.media;
}
