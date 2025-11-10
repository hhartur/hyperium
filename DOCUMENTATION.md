# Hyperium Game Store Documentation

This document provides a summary of the recent changes made to the Hyperium Game Store application.

## Features Implemented

### 1. Discount Functionality

- The application now supports discounts for games.
- When a discount is available, the game page displays the original price with a strikethrough and the new discounted price.
- The `add/page.tsx` page now includes a field to add a discount price when creating a new game.

### 2. Game Media

- The game page now displays a gallery of screenshots and a video trailer.
- The `add/page.tsx` page allows adding multiple screenshot URLs and a video URL when creating a new game.
- The video trailer is displayed in a modal window for a better user experience.

### 3. Game Ratings

- The application now includes a rating system for games.
- The `Game` model in the database has a new `rating` field, which stores the average rating of the game.
- The rating is calculated automatically based on user reviews.
- The game page displays the average rating and the total number of reviews for each game.

### 4. Game Comments and Reviews

- Users can now submit reviews for games, including a rating (from 1 to 5 stars) and a comment.
- The game page displays all the reviews for the game, including the user's avatar, username, rating, and comment.
- The application also includes a separate section for general comments without ratings.

## Bug Fixes

- Fixed a critical bug where `prisma` was being used directly on the client-side in several components (`GameDetails`, `GameReviews`, `GameComments`, and `CartProvider`).
- All database operations are now handled by API routes, ensuring that the database is not accessed directly from the client-side.

## API Routes

### New Routes

- `app/api/reviews/route.ts`: Handles fetching and submitting game reviews.
  - `GET /api/reviews?gameId=[gameId]`: Fetches all reviews for a specific game.
  - `POST /api/reviews`: Creates or updates a review for a game.
- `app/api/comments/route.ts`: Handles fetching and submitting game comments.
  - `GET /api/comments?gameId=[gameId]`: Fetches all comments for a specific game.
  - `POST /api/comments`: Creates a new comment for a game.

### Updated Routes

- `app/api/games/get-game/route.ts`: Updated to include the game's reviews and calculate the average rating.
- `app/api/games/route.ts`: Updated the `POST` method to handle the new fields (`discount_price`, `screenshots`, `video_url`, etc.) when creating a new game.
- `app/api/purchases/route.ts`: Added a `POST` method to handle the creation of new purchases and clear the user's cart.

## Database Schema Changes

- **`Game` model (`prisma/schema.prisma`):**
  - Added a `rating` field of type `Float` with a default value of `0` to store the average rating of the game.

## Frontend Components

### Modified Components

- `components/games/game-details.tsx`:
  - Updated to display the game's rating, review count, and video trailer.
  - Fixed the `addToCart` function to use an API call instead of a direct `prisma` call.
- `components/games/game-reviews.tsx`:
  - Updated to use API calls to fetch and submit reviews.
- `components/games/game-comments.tsx`:
  - Updated to use API calls to fetch and submit comments.
- `components/providers/cart-provider.tsx`:
  - Updated the `purchaseAll` function to use an API call instead of a direct `prisma` call.
- `app/games/[id]/page.tsx`:
  - Updated the `Game` interface to include the new `reviews` and `reviewCount` fields.
