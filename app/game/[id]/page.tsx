"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

import { GetGames } from "@/lib/routesHandler";
import { useEffect, useState } from "react";
import { Game } from "@/app/Type";

export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart(); // Hook para adicionar ao carrinho

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

  const game = games.find((g) => g.id === id);

if (!game && loading) {
    return (
      <main className="main-content">
        <h2>Carregando</h2>
      </main>
    );
  }

  if (!game && !loading) {
    return (
      <main className="main-content">
        <h2>Jogo não encontrado!</h2>
        <p>O jogo que você está procurando não existe ou foi removido.</p>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(game);
  };

  const displayPrice =
    game.price === 0
      ? "Grátis"
      : `R$ ${game.price.toFixed(2).replace(".", ",")}`;

  return (
    <main className="main-content" style={{ padding: "4rem 4%" }}>
      <div className="game-details-container">
        {/* Botão de voltar */}
        <button onClick={() => router.back()} className="back-to-store-btn">
          <i className="fa-solid fa-arrow-left"></i> Voltar para a Loja
        </button>

        <div className="game-details-grid">
          {/* Coluna da Imagem */}
          <div className="game-image-column">
            <Image
              src={game.imageUrl}
              alt={`Capa do jogo ${game.title}`}
              width={800}
              height={600}
              className="game-details-image"
            />
          </div>

          {/* Coluna de Informações e Compra */}
          <div className="game-info-column">
            <h1>{game.title}</h1>
            <p className="game-author">
              Vendido por <a href="#">{game.author}</a>
            </p>
            <p className="game-description">{game.description}</p>

            <div className="buy-box">
              <span className="game-price">{displayPrice}</span>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <i className="fa-solid fa-cart-plus"></i> Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
