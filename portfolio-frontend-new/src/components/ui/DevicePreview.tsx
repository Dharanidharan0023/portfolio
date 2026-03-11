'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DeviceType = 'laptop' | 'mobile';

interface DevicePreviewProps {
    laptopImage: string;
    mobileImage: string;
    title: string;
    className?: string;
}

export function DevicePreview({ laptopImage, mobileImage, title, className }: DevicePreviewProps) {
    const [device, setDevice] = React.useState<DeviceType>('laptop');

    return (
        <div className={cn("flex flex-col items-center gap-6", className)}>
            {/* Device Toggle */}
            <div className="flex p-1 bg-secondary/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm">
                <button
                    onClick={() => setDevice('laptop')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                        device === 'laptop' 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Laptop className="w-4 h-4" />
                    Laptop
                </button>
                <button
                    onClick={() => setDevice('mobile')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                        device === 'mobile' 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Smartphone className="w-4 h-4" />
                    Mobile
                </button>
            </div>

            {/* Preview Area */}
            <div className="relative w-full flex justify-center items-center min-h-[400px]">
                <AnimatePresence mode="wait">
                    {device === 'laptop' ? (
                        <motion.div
                            key="laptop"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-[800px] aspect-[16/10] bg-zinc-900 rounded-2xl md:rounded-[2rem] p-2 md:p-4 shadow-2xl border border-border"
                        >
                            {/* MacBook Screen border */}
                            <div className="relative w-full h-full bg-black rounded-xl md:rounded-2xl overflow-hidden border border-zinc-800">
                                {/* Camera notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-zinc-900 rounded-b-xl z-10 flex justify-center items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                                </div>
                                
                                <img 
                                    src={laptopImage} 
                                    alt={`${title} laptop preview`}
                                    className="w-full h-full object-cover object-top opacity-90 transition-opacity hover:opacity-100"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800';
                                    }}
                                />
                            </div>
                            
                            {/* Base of laptop */}
                            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 w-[110%] h-4 md:h-6 bg-zinc-300 dark:bg-zinc-800 rounded-b-[3rem] shadow-xl z-0" />
                            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 md:h-2 bg-zinc-400 dark:bg-zinc-600 rounded-t-xl z-20" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mobile"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-[280px] md:w-[320px] aspect-[9/19] bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-[6px] border-zinc-900 ring-1 ring-zinc-700"
                        >
                            {/* Phone Screen border */}
                            <div className="relative w-full h-full bg-black rounded-[2.2rem] overflow-hidden">
                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10 flex justify-between items-center px-2">
                                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                                </div>
                                
                                <img 
                                    src={mobileImage} 
                                    alt={`${title} mobile preview`}
                                    className="w-full h-full object-cover object-top opacity-90 transition-opacity hover:opacity-100"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=320';
                                    }}
                                />
                            </div>
                            
                            {/* Side buttons */}
                            <div className="absolute top-24 -left-[2px] w-[3px] h-12 bg-zinc-700 rounded-l-sm" />
                            <div className="absolute top-40 -left-[2px] w-[3px] h-12 bg-zinc-700 rounded-l-sm" />
                            <div className="absolute top-32 -right-[2px] w-[3px] h-16 bg-zinc-700 rounded-r-sm" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
