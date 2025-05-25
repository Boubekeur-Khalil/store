import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Primary Neutral Palette
        primary: {
          DEFAULT: '#7C92FC',
          900: '#1D317B',
          800: '#2D3D92',
          700: '#4226B5',
          600: '#5E43DB',
          500: '#7C92FC',
          400: '#FFFFFF',
          300: '#E5E5FF',
          200: '#E7D9FE',
          100: '#F7F4FF',
        },
        neutral: {
          DEFAULT: '#FFFFFF',
          900: '#171717',
          800: '#262626',
          700: '#404040',
          600: '#525252',
          500: '#737373',
          400: '#A3A3A3',
          300: '#D4D4D4',
          200: '#E5E5E5',
          100: '#F5F5F5',
        },
        // Success Palette
        success: {
          DEFAULT: '#9CD323',
          900: '#3B6506',
          800: '#467A0B',
          700: '#559711',
          600: '#77B519',
          500: '#9CD323',
          400: '#BCE455',
          300: '#C9F170',
          200: '#DEFA95',
          100: '#F2FED7',
        },
        // Error Palette
        error: {
          DEFAULT: '#FF4423',
          900: '#7A0919',
          800: '#93081B',
          700: '#B71112',
          600: '#DB2719',
          500: '#FF4423',
          400: '#FF7759',
          300: '#FFA37A',
          200: '#FFCBA6',
          100: '#FFE7D3',
        },
        // Warning Palette
        warning: {
          DEFAULT: '#FFC73A',
          900: '#7A4005',
          800: '#936312',
          700: '#B7821D',
          600: '#DBA32A',
          500: '#FFC73A',
          400: '#FFD98B',
          300: '#FFE488',
          200: '#FFEFBD',
          100: '#FFEBD7',
        },
        // Information Palette
        info: {
          DEFAULT: '#5AA6FF',
          900: '#1D327A',
          800: '#1A4395',
          700: '#3A65B7',
          600: '#5D81DB',
          500: '#5AA6FF',
          400: '#7CC2FF',
          300: '#8BD3FF',
          200: '#94E5FF',
          100: '#DCF2FF',
        },
        // Secondary Palette
        secondary: {
          DEFAULT: '#1A3D2C',
          900: '#040815',
          800: '#050C19',
          700: '#0D121F',
          600: '#131825',
          500: '#1A3D2C',
          400: '#5B6760',
          300: '#A0A38F',
          200: '#C5C6B3',
          100: '#E5E6F4',
        },
      },
      fontFamily: {
        regular: ["var(--font-regular)"],
        bold: ["var(--font-bold)"],
        black: ["var(--font-black)"],
        extrabold: ["var(--font-extrabold)"],
        extralight: ["var(--font-extralight)"],
        light: ["var(--font-light)"],
        medium: ["var(--font-medium)"],
        semibold: ["var(--font-semibold)"],
        thin: ["var(--font-thin)"],
        variable: ["var(--font-variable)"],
        revolution: ["var(--font-revolution)"],
      },
      keyframes: {
        "marquee-x": {
         from: { transform: "translateX(0)" },
         to: { transform: "translateX(calc(-100% - var(--gap)))" },
       },
       "marquee-y": {
         from: { transform: "translateY(0)" },
         to: { transform: "translateY(calc(-100% - var(--gap)))" },
       },
     },
     animation: {
       "marquee-horizontal": "marquee-x var(--duration) infinite linear",
       "marquee-vertical": "marquee-y var(--duration) linear infinite",
       },
      components: {
        // Product Detail Layout
        'product-detail': 'bg-white',
        'product-container': 'max-w-7xl mx-auto px-4 py-10',
        'product-layout': 'flex flex-col lg:flex-row gap-8',
        
        // Image Gallery
        'gallery-container': 'w-full lg:w-1/2 lg:pr-10',
        'primary-image': 'rounded-xl overflow-hidden mb-5',
        'gallery-grid': 'grid grid-cols-3 gap-4',
        'gallery-item': 'border rounded-lg overflow-hidden',
        'product-image': 'w-full h-auto object-cover',
        
        // Product Info
        'info-container': 'w-full lg:w-1/2 lg:pl-5',
        'product-header': 'flex items-center justify-between mb-2',
        'product-title': 'text-2xl font-bold',
        'rating-container': 'stars text-xl',
        'review-count': 'text-sm text-gray-500 mb-5',
        
        // Price Section
        'price-container': 'flex items-center mb-5',
        'current-price': 'text-2xl font-bold mr-4',
        'original-price': 'text-lg text-gray-400 line-through mr-3',
        'sale-badge': 'bg-red-500 text-white text-xs px-2 py-1 rounded',
        
        // Description
        'product-description': 'text-gray-600 mb-8 leading-relaxed',
        
        // Variants
        'variants-section': 'mb-8',
        'variants-title': 'font-medium mb-4',
        'variants-grid': 'grid grid-cols-2 gap-4',
        'variant-button': 'p-4 border rounded-lg',
        'variant-selected': 'border-black bg-gray-50',
        'variant-unselected': 'border-gray-200',
        
        // Quantity Selector
        'quantity-container': 'flex items-center mb-8',
        'quantity-button': 'w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer',
        'quantity-input': 'w-16 h-9 mx-3 text-center border-none',
        
        // Add to Cart
        'add-to-cart': 'w-full py-6 rounded-full bg-black hover:bg-gray-800 text-white mb-8 cursor-pointer',
        'out-of-stock': 'w-full py-6 rounded-full bg-gray-200 text-gray-600 text-center mb-8',
        
        // Reviews
        'review-form': 'bg-gray-50 p-6 rounded-lg space-y-4',
        'review-input': 'w-full p-2 border rounded-md',
        'review-textarea': 'w-full p-2 border rounded-md h-32',
        'review-item': 'border-b pb-6',
        
        // Related Products
        'related-section': 'py-16',
        'related-title': 'text-3xl font-bold text-center mb-10',
        
        // Cart Button
        'cart-button': {
          base: 'w-full py-6 rounded-full transition-colors duration-200',
          default: 'bg-black hover:bg-gray-800 text-white',
          disabled: 'bg-gray-200 text-gray-500 cursor-not-allowed',
          loading: 'bg-gray-800 text-gray-300 cursor-wait'
        }
      },
    },
  },
  plugins: [],
}

export default config
