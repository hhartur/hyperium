"use client";

import GameCard from "@/components/GameCard";
import { GetGames } from "@/lib/routesHandler";
import { useEffect, useState } from "react";
import { Game } from "./Type";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      const gg = await GetGames();
      if (gg != null) {
        setGames(gg);
      }
      setLoading(false);
    };

    fetchGames();
  }, []);

  return (
    <main
      className="main-content"
      style={{ minHeight: "calc(100vh - 80px - 280px)", padding: "4rem 4%" }}
    >
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Russo One', sans-serif",
            fontSize: "2rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Jogos em Destaque
        </h2>

        <div className="profile-products-grid">
          {loading ? (
            <p>Carregando jogos...</p>
          ) : games.length > 0 ? (
            games.map((game) => <GameCard key={game.id} game={game} />)
          ) : (
            <p>Jogos não encontrados</p>
          )}
        </div>
      </div>
    </main>
  );
}
