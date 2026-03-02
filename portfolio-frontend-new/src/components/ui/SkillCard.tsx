'use client';

import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface SkillCardProps {
    name: string;
    percentage: number;
    icon?: string;
    category?: string;
    index?: number;
}

export function SkillCard({ name, percentage, icon, category, index = 0 }: SkillCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative p-6 rounded-2xl glass transition-all overflow-hidden border border-border/40 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] bg-background/50"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            250px circle at ${mouseX}px ${mouseY}px,
                            var(--primary) 0%,
                            transparent 80%
                        )
                    `,
                    opacity: 0.15,
                }}
            />

            <div className="relative z-10 flex items-center gap-5 w-full">
                {icon && (
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner overflow-hidden group-hover:border-primary/50 transition-colors">
                        <img src={icon} alt={name} className="w-8 h-8 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_#3b82f6]" />
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{name}</h3>
                    {category && <p className="text-sm text-muted-foreground tracking-wide mt-1">{category}</p>}
                </div>
            </div>
        </motion.div>
    );
}
