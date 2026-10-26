import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { DEMO_GAMES } from '@/data/games';
import { GameDetailClient } from '@/components/game/GameDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DEMO_GAMES.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = DEMO_GAMES.find((g) => g.slug === slug);

  if (!game) {
    return {
      title: 'Không tìm thấy game — GameHub',
    };
  }

  return {
    title: `${game.title} — Mua Key Bản Quyền PC | GameHub`,
    description: game.shortDescription,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const game = DEMO_GAMES.find((g) => g.slug === slug);

  if (!game) {
    notFound();
  }

  return <GameDetailClient game={game} />;
}
