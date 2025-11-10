'use client'

import { GameGrid } from '@/components/games/game-grid'
import { GameCategories } from '@/components/games/game-categories'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n';

export default function GamesPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('all_games')}</h1>
          <p className="text-muted-foreground">{t('discover_games')}</p>
        </div>
        <Button asChild>
          <Link href="/games/add">{t('add_your_game')}</Link>
        </Button>
      </div>

      <GameCategories />

      <div className="mt-8">
        <GameGrid />
      </div>
    </div>
  )
}
