"use client";

import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, totalPrice, cartCount } = useCart();

  const displayTotalPrice = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

  return (
    <main className="main-content" style={{ padding: '4rem 4%' }}>
      <div className="cart-container">
        <h2 style={{ fontFamily: "'Russo One', sans-serif", fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          Meu Carrinho de Compras
        </h2>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <i className="fa-solid fa-cart-shopping"></i>
            <h3>Seu carrinho está vazio</h3>
            <p>Adicione jogos à sua coleção para vê-los aqui.</p>
            <Link href="/" className="auth-btn">
              Explorar Jogos
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Itens do Carrinho */}
            <div className="cart-items-list">
              <div className="cart-header">
                <span>Produto</span>
                <span className="header-quantity">Quantidade</span>
                <span className="header-price">Preço</span>
                <span></span>
              </div>
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="cart-summary">
              <h4>Resumo do Pedido</h4>
              <div className="summary-row">
                <span>Subtotal ({cartCount} {cartCount > 1 ? 'itens' : 'item'})</span>
                <span>{displayTotalPrice}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{displayTotalPrice}</span>
              </div>
              <button className="checkout-btn">Finalizar Compra</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}