'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Trophy, Award, Star, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

export default function AchievementsPage() {
    const [achievements, setAchievements] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await api.get('/Achievements/public');
                setAchievements(response.data);
            } catch (error) {
                console.error('Error fetching achievements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="py-20 animate-in">
            <Container>
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl font-extrabold mb-6">Achievements & Certifications</h1>
                    <p className="text-xl text-muted-foreground">
                        A recognition of my hard work, continuous learning, and professional milestones.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {achievements.map((ach, index) => (
                        <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl glass hover:border-primary/50 transition-all group flex flex-col"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Trophy className="w-8 h-8 text-primary" />
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{ach.title}</h3>
                            <p className="text-muted-foreground text-sm mb-6 flex-1">{ach.description}</p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    {ach.issuer || "Institution"}
                                </div>
                                <div className="text-xs font-bold text-primary">
                                    {new Date(ach.dateAchieved).getFullYear()}
                                </div>
                            </div>

                            {ach.url ? (
                                <a
                                    href={ach.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 flex items-center text-sm font-medium text-primary hover:underline gap-1"
                                >
                                    View Certificate
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            ) : (
                                <p className="mt-4 flex items-center text-sm font-medium text-muted-foreground gap-1">
                                    Certificate not available
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {achievements.length === 0 && (
                    <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
                        <p className="text-muted-foreground">Achievements list is currently being updated.</p>
                    </div>
                )}
            </Container>
        </div>
    );
}
