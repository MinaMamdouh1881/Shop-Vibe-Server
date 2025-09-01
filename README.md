# Shop Vibe Server

Shop Vibe Server is an Express.js backend for an e-commerce platform, supporting user authentication (including Google and Facebook OAuth), product management, cart and wishlist features, and checkout/payment integration.

## Features

- User authentication (local, Google, Facebook)
- Product catalog with categories (blouse, heels, pants, shirt, shoes, skirt, t-shirt)
- Cart and wishlist management
- Payment integration (Paymob)
- Static serving of product images and JSON data
- Privacy Policy and Terms of Service pages

## Project Structure

```
.env
.gitignore
nodemon.json
package.json
products.schema.json
tsconfig.json
public/
  [product JSON files & images]
src/
  app.ts
  server.ts
  config/
  controllers/
  lib/
  middlewares/
  modules/
  routes/
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/shop-vibe-server.git
   cd shop-vibe-server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   JWT_SECRET=your_jwt_secret
   CLIENT_URI=http://localhost:5173
   SERVER_URI=http://localhost:4000
   GMAIL_USER=your_gmail_address
   GMAIL_PASS=your_gmail_app_password
   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   PAY_MOB_API_KEY=your_paymob_api_key
   PAY_MOB_INTEGRATION_ID=your_paymob_integration_id
   PAY_MOB_IFRAME_ID=your_paymob_iframe_id
   PAY_MOB_HMAC_KEY=your_paymob_hmac_key
   ```

### Development

Start the development server with hot reload:
```sh
npm run dev
```

### Build

Compile TypeScript to JavaScript:
```sh
npm run build
```

### Production

Start the server:
```sh
npm start
```

## API Endpoints

- `/auth` - Authentication routes (login, signup, OAuth, password reset)
- `/products` - Product catalog endpoints
- `/cartAndFav` - Cart and wishlist management
- `/checkout` - Payment and checkout
- `/page` - Privacy Policy and Terms of Service

See the [src/routes](src/routes) directory for details.
