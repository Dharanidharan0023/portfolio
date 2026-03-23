'use client';

import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SkillCardProps {
    name: string;
    percentage?: number;
    icon?: string;
    category?: string;
    index?: number;
}

export function SkillCard({ name, icon, category, index = 0 }: SkillCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
    const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;

        mouseX.set(cx);
        mouseY.set(cy);

        x.set(cx / width - 0.5);
        y.set(cy / height - 0.5);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <motion.div
            style={{ 
                rotateX, 
                rotateY, 
                transformStyle: "preserve-3d",
                boxShadow: useMotionTemplate`
                    ${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.1),
                    0 10px 20px rgba(0, 0, 0, 0.05)
                `
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative h-48 w-full rounded-3xl bg-secondary/20 backdrop-blur-2xl border border-white/10 hover:border-primary/40 transition-colors duration-500 overflow-hidden cursor-none shadow-2xl"
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            250px circle at ${mouseX}px ${mouseY}px,
                            rgba(59, 130, 246, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            <div className="relative z-10 p-8 flex flex-col h-full items-center justify-center text-center space-y-4" style={{ transform: "translateZ(50px)" }}>
                {icon && (
                    <div className="w-16 h-16 rounded-2xl bg-background/40 flex items-center justify-center border border-white/5 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
                        <img 
                            src={icon} 
                            alt={name} 
                            className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                        />
                    </div>
                )}
                
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {name}
                    </h3>
                    {category && (
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                            {category}
                        </span>
                    )}
                </div>
            </div>

            {/* Ambient Border Glow */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}
