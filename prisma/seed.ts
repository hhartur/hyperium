import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'seller@example.com',
      username: 'seller1',
      password_hash: '$2b$10$dummy.hash.for.demo',
      email_verified: true,
      is_admin: false,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      username: 'buyer1',
      password_hash: '$2b$10$dummy.hash.for.demo',
      email_verified: true,
      is_admin: false,
    },
  });

  // Create sample games
  const game1 = await prisma.game.create({
    data: {
      seller_id: user1.id,
      title: 'Epic Adventure Game',
      description: 'An amazing adventure game with stunning graphics and engaging storyline.',
      price: 29.99,
      discount_price: 24.99,
      developer: 'Indie Studios',
      publisher: 'Game Publishers Inc',
      release_date: new Date('2023-06-15'),
      genre: ['Action', 'Adventure'],
      tags: ['RPG', 'Fantasy'],
      image_url: 'https://example.com/game1.jpg',
      screenshots: ['https://example.com/screenshot1.jpg'],
      video_url: 'https://youtube.com/watch?v=dummy1',
      file_url: 'https://example.com/download/game1.zip',
      user_id: user1.id,
    },
  });

  const game2 = await prisma.game.create({
    data: {
      seller_id: user1.id,
      title: 'Puzzle Master',
      description: 'Challenge your mind with this brain-teasing puzzle game.',
      price: 14.99,
      developer: 'Puzzle Games Ltd',
      publisher: 'Brain Teasers Inc',
      release_date: new Date('2023-08-20'),
      genre: ['Puzzle', 'Strategy'],
      tags: ['Logic', 'Brain Training'],
      image_url: 'https://example.com/game2.jpg',
      screenshots: ['https://example.com/screenshot2.jpg'],
      video_url: 'https://youtube.com/watch?v=dummy2',
      file_url: 'https://example.com/download/game2.zip',
      user_id: user1.id,
    },
  });

  const game3 = await prisma.game.create({
    data: {
      seller_id: user1.id,
      title: 'Racing Thunder',
      description: 'High-speed racing action with realistic physics and stunning visuals.',
      price: 39.99,
      discount_price: 34.99,
      developer: 'Speed Studios',
      publisher: 'Racing Games Corp',
      release_date: new Date('2023-09-10'),
      genre: ['Racing', 'Action'],
      tags: ['Cars', 'Multiplayer'],
      image_url: 'https://example.com/game3.jpg',
      screenshots: ['https://example.com/screenshot3.jpg'],
      video_url: 'https://youtube.com/watch?v=dummy3',
      file_url: 'https://example.com/download/game3.zip',
      user_id: user1.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
