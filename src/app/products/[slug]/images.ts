// images.ts
export const images = {
  logo: "/logo/svg/logo.svg",
  // Add other global images here
} as const;
export const ProductImages = {
  // Hero banner
  heroBanner: "/images/banner.png",
  
  // Product images
  products: {
    "hands-vibe": {
      main: "/images/curved-vibe.png",
      gallery: [
        "/images/curved-vibe.png",
        "/images/curved-vibe.png",
        "/images/curved-vibe.png"
      ]
    },
    "hands-magma": {
      main: "/images/hands-magma.png",
      gallery: [
        "/images/hands-magma.png",
        "/images/hands-magma.png",
        "/images/hands-magma.png",
      ]
    },
  },
  
  placeholder: "/images/placeholder.jpg"
} as const;