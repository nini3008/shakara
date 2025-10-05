// app/artists/page.tsx

import { client, urlFor, ARTIST_QUERY } from '@/lib/sanity';
import { Artist } from '@/types';
import { SanityArtist, adaptSanityArtist } from '@/types/sanity-adapters';
import Image from 'next/image';
import Link from 'next/link';
import LayoutWrapper from '@/components/v2/LayoutWrapper';
import ThemedContent from '@/components/ThemedContent';

async function getArtists(): Promise<{ artists: Artist[], sanityArtists: SanityArtist[] }> {
  try {
    const sanityArtists: SanityArtist[] = await client.fetch(ARTIST_QUERY);
    const artists = sanityArtists.map(adaptSanityArtist);
    return { artists, sanityArtists };
  } catch (error) {
    console.error('Error fetching artists:', error);
    return { artists: [], sanityArtists: [] };
  }
}

export default async function ArtistsPage() {
  const { artists, sanityArtists } = await getArtists();

  if (artists.length === 0) {
    return (
      <LayoutWrapper currentPageName="Artists">
        <ThemedContent transparent>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-4">
              <h1 className="text-2xl font-bold mb-4 text-white">No Artists Found</h1>
              <p className="text-gray-400 mb-8">Check your Sanity Studio and make sure you have artists published.</p>
              <Link 
                href="/" 
                className="inline-block gradient-bg text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </ThemedContent>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper currentPageName="Artists">
      <ThemedContent transparent>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              <span className="gradient-text">
                Artists
              </span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Discover the incredible talent performing at Shakara Festival 2025
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {artists.map((artist, index) => {
              const sanityArtist = sanityArtists[index];
              return (
                <ArtistCard key={artist.id} artist={artist} sanityArtist={sanityArtist} />
              );
            })}
          </div>
        </div>
      </ThemedContent>
    </LayoutWrapper>
  );
}

function ArtistCard({ artist, sanityArtist }: { artist: Artist, sanityArtist: SanityArtist }) {
  return (
    <Link href={`/artists/${sanityArtist.slug.current}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-900 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-yellow-400/20">
        {sanityArtist.image ? (
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={urlFor(sanityArtist.image).width(300).height(300).url()}
              alt={artist.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-black font-space-grotesk">
              {artist.name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {sanityArtist.featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded uppercase tracking-wide">
              Featured
            </span>
          </div>
        )}
        
        {/* Artist Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold mb-1 text-white group-hover:text-yellow-400 transition-colors truncate">
            {artist.name}
          </h3>
          {artist.genre && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded uppercase tracking-wide">
              {artist.genre}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}