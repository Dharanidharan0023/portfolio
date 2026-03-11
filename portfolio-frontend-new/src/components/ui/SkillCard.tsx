'use client';

import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

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

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

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
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative h-full w-full rounded-2xl md:rounded-3xl bg-secondary/30 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-colors duration-500 overflow-hidden cursor-crosshair shadow-lg hover:shadow-xl dark:shadow-none"
        >
            {/* Inner Glow driven by mouse */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            150px circle at ${mouseX}px ${mouseY}px,
                            rgba(99,102,241,0.15) 0%,
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Apple-like Shimmer Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-12 scale-150 pointer-events-none" />

            <div className="relative z-10 p-5 md:p-6 flex flex-col h-full items-start justify-between min-h-[160px]" style={{ transform: "translateZ(30px)" }}>
                <div className="flex justify-between w-full items-start gap-4">
                    {icon && (
                        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-background/50 flex items-center justify-center border border-border/50 shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out">
                            <img src={icon} alt={name} className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                        </div>
                    )}
                    {category && (
                        <span className="text-[10px] md:text-[11px] uppercase tracking-widest font-semibold text-muted-foreground group-hover:text-primary transition-colors text-right">
                            {category}
                        </span>
                    )}
                </div>
                <div className="mt-6 md:mt-8 w-full">
                    <h3 className="text-lg md:text-xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">{name}</h3>

                    {/* Minimal Progress Bar */}
                    <div className="w-full h-1.5 bg-secondary rounded-full mt-3 overflow-hidden relative border border-border/30">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                            initial={{ x: "-100%" }}
                            whileInView={{ x: 0 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                            viewport={{ once: true }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
