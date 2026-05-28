'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';

interface HeroProps {
    name?: string;
    title?: string;
    bio?: string;
}

export function Hero({ name = "Dharanidharan", title = "Full Stack Developer", bio = "I build modern, scalable, and user-centric web applications and digital experiences." }: HeroProps) {
    return (
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden pt-24 pb-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <Container className="relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="order-2 lg:order-1"
                    >
                        <Link href="/admin" className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase mb-6 border border-primary/30 shadow-[0_0_20px_#3b82f64d] hover:bg-primary/20 transition-colors cursor-pointer">
                            Full Stack Developer
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                            Hi, I&apos;m <br className="hidden md:block" />
                            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                                {name}
                            </span>
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-8">
                            {title}
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                            {bio}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/projects">
                                <Button className="group" size="lg">
                                    View Projects
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <a href="/resume.pdf" download="Dharanidharan_Resume.pdf" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="lg" className="group border-primary/50 hover:bg-primary/10 hover:text-primary transition-colors">
                                    <Download className="mr-2 w-4 h-4" />
                                    Download Resume
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    {/* Profile Image Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-1 lg:order-2 flex justify-center lg:justify-end"
                    >
                        <div className="relative w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96">
                            <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-20 animate-pulse" />
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-blue-500/30 rounded-full blur-xl animate-spin-slow" style={{ animationDuration: '15s' }} />

                            <div className="relative w-full h-full rounded-full border-2 border-primary/30 p-2 overflow-hidden glass shadow-2xl backdrop-blur-sm">
                                <img
                                    src="/profile.jpg"
                                    alt={name}
                                    className="w-full h-full object-cover rounded-full select-none pointer-events-none"
                                    onError={(e) => {
                                        // Fallback if image not found
                                        e.currentTarget.src = 'https://ui-avatars.com/api/?name=Dharanidharan+K&size=512&background=0D8ABC&color=fff';
                                    }}
                                />
                            </div>

                            {/* Decorative floating badges */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 -left-6 md:-left-12 glass px-4 py-2 rounded-xl border border-border/50 text-sm font-bold shadow-lg flex items-center gap-2"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Open to Work
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
