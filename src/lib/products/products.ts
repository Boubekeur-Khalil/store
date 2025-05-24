// lib/products/products.ts
import { Product } from "@/lib/types/product";

export const products: Product[] = [
  {
    id: "vibe",
    slug: "hands-vibe",
    name: "HANDS VIBE",
    description: '27" 4K UHD IPS Monitor',
    price: "299 DZD",
    originalPrice: "349 DZD",
    discount: "-14%",
    rating: 4.6,
    reviews: 128,
    screenSize: '27"',
    colors: [
      { name: "Black", value: "#333333", active: true },
      { name: "Silver", value: "#C0C0C0", active: false },
    ],
    sizes: [
      { name: '24"', active: false },
      { name: '27"', active: true },
    ],
    details: [
      "Resolution: 3840 x 2160 (4K UHD)",
      "Refresh Rate: 60Hz",
      "Response Time: 4ms",
      "Panel Type: IPS",
      "Color Gamut: 99% sRGB",
      "Brightness: 350 nits",
      "Connectivity: 2x HDMI 2.0, 1x DisplayPort 1.4",
      "VESA Mount Compatible: 100x100mm",
      "Built-in Speakers: 2x5W",
      "Eye Care Technology: Flicker-free, Low Blue Light"
    ],
    reviewList: [
      {
        id: 1,
        name: "Alex J.",
        rating: 5,
        date: "July 15, 2023",
        content: "The color accuracy is amazing for photo editing. Perfect for my design work."
      },
      {
        id: 2,
        name: "Sarah K.",
        rating: 4,
        date: "August 2, 2023",
        content: "Great monitor for the price. Only wish it had USB-C connectivity."
      }
    ],
    faqs: [
      {
        question: "Does this support HDR?",
        answer: "Yes, it supports HDR10 content."
      },
      {
        question: "Is this good for gaming?",
        answer: "While it's not specifically a gaming monitor, the 4ms response time is decent for casual gaming."
      }
    ]
  },
  {
    id: "magma",
    slug: "hands-magma",
    name: "HANDS MAGMA PRO",
    description: '32" QHD 165Hz Gaming Monitor',
    price: "499 DZD",
    originalPrice: "599 DZD",
    discount: "-17%",
    rating: 4.8,
    reviews: 256,
    screenSize: '32"',
    colors: [
      { name: "Black", value: "#333333", active: true },
      { name: "Red", value: "#FF0000", active: false },
    ],
    sizes: [
      { name: '27"', active: false },
      { name: '32"', active: true },
    ],
    details: [
      "Resolution: 2560 x 1440 (QHD)",
      "Refresh Rate: 165Hz",
      "Response Time: 1ms (MPRT)",
      "Panel Type: Fast IPS",
      "Adaptive Sync: FreeSync Premium Pro",
      "Brightness: 400 nits",
      "Connectivity: 2x HDMI 2.1, 1x DisplayPort 1.4, USB Hub",
      "VESA Mount Compatible: 100x100mm",
      "RGB Lighting: Customizable rear lighting",
      "Gaming Features: Black Stabilizer, Crosshair Overlay"
    ],
    reviewList: [
      {
        id: 1,
        name: "Michael T.",
        rating: 5,
        date: "September 5, 2023",
        content: "The 165Hz refresh rate makes games buttery smooth. No ghosting at all!"
      },
      {
        id: 2,
        name: "Jessica L.",
        rating: 5,
        date: "September 12, 2023",
        content: "Upgraded from a 60Hz monitor and the difference is night and day."
      }
    ],
    faqs: [
      {
        question: "Is this G-Sync compatible?",
        answer: "Yes, it works with both FreeSync and G-Sync compatible systems."
      },
      {
        question: "Does it have speakers?",
        answer: "No, this model focuses on gaming performance and doesn't include speakers."
      }
    ]
  },
  {
    id: "aero",
    slug: "hands-aero",
    name: "HANDS AERO",
    description: '27" 4K UHD IPS Monitor',
    price: "399 DZD",
    originalPrice: "449 DZD",
    discount: "-11%",
    rating: 4.5,
    reviews: 89,
    screenSize: '27"',
    colors: [
      { name: "Black", value: "#333333", active: true },
      { name: "White", value: "#FFFFFF", active: false },
    ],
    sizes: [
      { name: '24"', active: false },
      { name: '27"', active: true },
    ],
    details: [
      "Resolution: 3840 x 2160 (4K UHD)",
      "Refresh Rate: 60Hz",
      "Response Time: 5ms",
      "Panel Type: IPS",
      "Color Gamut: 100% sRGB",
      "Brightness: 350 nits",
      "Connectivity: 2x HDMI 2.0, 1x DisplayPort 1.4, USB-C",
      "VESA Mount Compatible: 100x100mm",
      "Built-in Speakers: No",
      "Eye Care Technology: Flicker-free, Low Blue Light"
    ],
    reviewList: [
      {
        id: 1,
        name: "David R.",
        rating: 4,
        date: "October 1, 2023",
        content: "Great monitor for the price. Perfect for my office setup."
      },
      {
        id: 2,
        name: "Emily W.",
        rating: 5,
        date: "October 10, 2023",
        content: "The color accuracy is spot on. Highly recommend for designers."
      }
    ],
    faqs: [
      {
        question: "Does it support HDR?",
        answer: "Yes, it supports HDR10 content."
      },
      {
        question: "Is this good for gaming?",
        answer: "While it's not specifically a gaming monitor, the response time is decent for casual gaming."
      }
    ]
  },
  {
    id: "nova",
    slug: "hands-nova",
    name: "HANDS NOVA",
    description: '32" QHD 144Hz Gaming Monitor',
    price: "599 DZD",
    originalPrice: "699 DZD",
    discount: "-14%",
    rating: 4.7,
    reviews: 145,
    screenSize: '32"',
    colors: [
      { name: "Black", value: "#333333", active: true },
      { name: "Blue", value: "#0000FF", active: false },
    ],
    sizes: [
      { name: '27"', active: false },
      { name: '32"', active: true },
    ],
    details: [
      "Resolution: 2560 x 1440 (QHD)",
      "Refresh Rate: 144Hz",
      "Response Time: 1ms (MPRT)",
      "Panel Type: Fast IPS",
      "Adaptive Sync: FreeSync Premium",
      "Brightness: 400 nits",
      "Connectivity: 2x HDMI 2.1, 1x DisplayPort 1.4, USB Hub",
      "VESA Mount Compatible: 100x100mm",
      "RGB Lighting: Customizable rear lighting",
      "Gaming Features: Black Stabilizer, Crosshair Overlay"
    ],
    reviewList: [
      {
        id: 1,
        name: "Chris P.",
        rating: 5,
        date: "November 5, 2023",
        content: "The colors are vibrant and the refresh rate is perfect for gaming."
      },
      {
        id: 2,
        name: "Anna S.",
        rating: 4,
        date: "November 12, 2023",
        content: "Great monitor but wish it had built-in speakers."
      }
    ],
    faqs: [
      {
        question: "Is this G-Sync compatible?",
        answer: "Yes, it works with both FreeSync and G-Sync compatible systems."
      },
      {
        question: "Does it have speakers?",
        answer: "No, this model focuses on gaming performance and doesn't include speakers."
      }
    ]
  }
  
];