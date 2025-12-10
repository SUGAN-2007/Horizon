# Horizon - E-Commerce Website

A modern, responsive e-commerce website built with React and CSS. Horizon is a forward-driven clothing brand platform featuring a clean, modern design with seamless shopping experience.

## Tech Stack

- **React** - Frontend framework
- **CSS** - Styling and responsive design
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and development server

## Features

- 🏠 **Home Page** - Featured products and brand showcase
- 🛍️ **Shop Page** - Browse and explore product catalog
- 🔍 **Search Functionality** - Real-time product search
- 🛒 **Shopping Cart** - Add items to cart and manage orders
- 👤 **User Account** - Login and profile management
- 📧 **Contact Form** - Get in touch with the team
- 📱 **Responsive Design** - Optimized for all devices

## Project Structure

```
src/
├── Components/      # Reusable React components
│   ├── Nav.jsx      # Navigation bar
│   ├── Cart.jsx     # Product cart component
│   ├── Search.jsx   # Search functionality
│   ├── Footer.jsx   # Footer component
│   └── ...
├── Pages/           # Page components
│   ├── Home.jsx     # Home page
│   ├── Shop.jsx     # Shop page
│   ├── Contact.jsx  # Contact page
│   └── ...
├── css/             # Stylesheet files
│   ├── App.css
│   ├── Nav.css
│   ├── Cart.css
│   └── ...
└── App.jsx          # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd E-com
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The project uses the Fake Store API for product data:
- Product listing: `https://fakestoreapi.com/products`

## Responsive Design

The website is fully responsive and optimized for:
- Desktop (1024px+)
- Tablets (768px - 1024px)
- Mobile devices (480px - 768px)
- Small mobile devices (< 480px)

## License

This project is private and proprietary.
