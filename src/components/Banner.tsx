'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

const Banner = () => {
    const pathname = usePathname()
    
    // Hide banner on 404 page and non-product pages
    const shouldShowBanner = () => {
        // Pages where banner should be hidden
        const hiddenPaths = ['/404', '/not-found']
        
        // Only show on home page and product-related pages
        const showOnPaths = ['/', '/products', '/cart', '/checkout']
        
        // Check if current path starts with any of the allowed paths
        return !hiddenPaths.includes(pathname) && 
               (showOnPaths.includes(pathname) || 
                pathname.startsWith('/product/') || 
                pathname.startsWith('/products/') || 
                pathname.startsWith('/category/'))
    }
    
    if (!shouldShowBanner()) return null
    
    return (
        <div className='h-[45px] bg-black flex items-center justify-center text-white text-sm font-bold overflow-hidden'>
            <div className='marquee-container'>
                <div className='marquee-content'>
                    <p className='text-[20px] mx-8'>Free Delivery on orders above 150 DZD</p>
                    <p className='text-[20px] mx-8'>Free Delivery on orders above 150 DZD</p>
                    <p className='text-[20px] mx-8'>Free Delivery on orders above 150 DZD</p>
                </div>
            </div>
            <style jsx>{`
                .marquee-container {
                    width: 100%;
                    overflow: hidden;
                }
                
                .marquee-content {
                    display: flex;
                    animation: scroll 15s linear infinite;
                    animation-duration: 10s;
                    justify-content: space-around;
                }
                
                @keyframes scroll {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
        </div>
    )
}

export default Banner