'use client'


import { GameModeration } from '@/components/admin/game-moderation';

export default function AdminGamesPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Game Moderation</h1>
        <p className="text-muted-foreground">Approve or reject games.</p>
      </div>
      <GameModeration />
    </>
  );
}
