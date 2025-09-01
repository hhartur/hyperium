// Arquivo: components/GameCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/app/Type';

type GameCardProps = {
  game: Game;
};

export default  function GameCard({ game }: GameCardProps) {
  const displayPrice = game.price === 0 ? 'Grátis' : `R$ ${game.price.toFixed(2).replace('.', ',')}`;

  return (
    <Link href={`/game/${game.id}`} className="product-card">
      <div className="product-card-image">
        <Image
          src={game.imageUrl}
          alt={`Capa do jogo ${game.title}`}
          width={400}
          height={300}
          // NENHUMA propriedade style aqui!
        />
      </div>
      <div className="product-card-info">
        <h3>{game.title}</h3>
        <p className="product-card-author">por {game.author}</p>
        <p className="product-card-price">{displayPrice}</p>
      </div>
    </Link>
  );
}