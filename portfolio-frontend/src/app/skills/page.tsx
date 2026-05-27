'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SkillCard } from '@/components/ui/SkillCard';
import api from '@/lib/api';

export default function SkillsPage() {
    const [skills, setSkills] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeCategory, setActiveCategory] = React.useState<string>('All');

    React.useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get('/Skills/public');
                setSkills(response.data);
            } catch (error) {
                console.error('Error fetching skills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const categories = ['All', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean)))];

    const filteredSkills = skills.filter(
        skill => activeCategory === 'All' || skill.category === activeCategory
    );

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 md:py-32 relative overflow-hidden bg-background text-foreground">
            {/* Apple-style Aurora Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] mix-blend-screen dark:mix-blend-screen animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            <Container>
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mb-16 md:mb-24 text-center mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter mb-6 md:mb-8 leading-tight">
                        Technical <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Expertise.</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto px-4">
                        A curated showcase of my technical arsenal. Crafted with precision, engineered for performance.
                    </p>
                </motion.div>

                {/* Filter Ribbon */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-16 px-4"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 md:py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeCategory === category
                                    ? 'text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                    : 'text-muted-foreground bg-secondary/50 hover:bg-secondary border border-border/50'
                                }`}
                        >
                            <span className="relative z-10">{category}</span>
                            {activeCategory === category && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-primary"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Skills Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-0">
                    <AnimatePresence mode="popLayout">
                        {filteredSkills.map((skill, index) => (
                            <motion.div
                                key={skill.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                            >
                                <SkillCard
                                    name={skill.name}
                                    icon={skill.icon}
                                    category={skill.category}
                                    index={index}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </Container>
        </div>
    );
}
