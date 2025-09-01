"use client";

import Image from 'next/image';
import { CartItem as CartItemType, useCart } from '@/context/CartContext';

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const displayPrice = `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <Image src={item.imageUrl} alt={item.title} width={120} height={90} />
      </div>
      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p>por {item.author}</p>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <input type="text" value={item.quantity} readOnly />
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <div className="cart-item-price">
        <span>{displayPrice}</span>
      </div>
      <div className="cart-item-remove">
        <button onClick={() => removeFromCart(item.id)} title="Remover item">
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  );
}