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
