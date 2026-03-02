'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SkillCard } from '@/components/ui/SkillCard';
import api from '@/lib/api';

export default function SkillsPage() {
    const [skills, setSkills] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

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

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            </div>
        );
    }

    return (
        <div className="py-24 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />

            <Container>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-20 text-center mx-auto"
                >
                    <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                        EXPERTISE
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Technical Arsenal
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        A comprehensive overview of my technical proficiency, showcasing the languages, frameworks, and tools I use to build robust applications.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((skill, index) => (
                        <SkillCard
                            key={skill.id}
                            name={skill.name}
                            percentage={skill.percentage}
                            icon={skill.icon}
                            category={skill.category}
                            index={index}
                        />
                    ))}
                </div>
            </Container>
        </div>
    );
}
