'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

export default function ExperiencePage() {
    const [experiences, setExperiences] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await api.get('/Experiences/public');
                setExperiences(response.data);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
            </div>
        );
    }

    return (
        <div className="py-12 md:py-24 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

            <Container>
                <div className="max-w-4xl mx-auto mb-12 md:mb-20 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-4 md:mb-6 text-xs md:text-sm font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
                            Professional Path
                        </span>
                        <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-8 tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            Career Journey
                        </h1>
                        <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl px-4 md:px-0">
                            A curated timeline of my professional work experience, industry contributions, and technical leadership roles.
                        </p>
                    </motion.div>
                </div>

                <div className="relative max-w-5xl mx-auto pl-4 md:pl-0">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 md:w-1 bg-gradient-to-b from-primary/50 via-border to-transparent md:-translate-x-1/2 block" />
                    
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className={`relative flex flex-col md:flex-row items-center justify-between mb-12 md:mb-24 group ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        >
                            {/* Timeline Point */}
                            <div className="absolute left-0 md:left-1/2 w-3 md:w-4 h-3 md:h-4 rounded-full bg-background border-2 md:border-4 border-primary shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10 md:-translate-x-1/2 transition-transform duration-300 group-hover:scale-150" />

                            {/* Date Label (Desktop Only) */}
                            <div className={`hidden md:block w-[45%] ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                                <time className="text-2xl font-black text-muted-foreground group-hover:text-primary transition-colors duration-300">
                                    {new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present')}
                                </time>
                                <p className="text-sm font-medium text-muted-foreground/60 mt-1 uppercase tracking-widest italic">
                                    {exp.location || "Remote / Office"}
                                </p>
                            </div>

                            {/* Card Content */}
                            <div className={`w-full ml-8 md:ml-0 md:w-[45%] p-6 md:p-8 rounded-2xl md:rounded-[2rem] glass-card border-white/5 group-hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5`}>
                                <div className="md:hidden flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded">
                                        {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present')}
                                    </span>
                                    {exp.location && (
                                        <span className="text-[10px] text-muted-foreground flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {exp.location}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-4 mb-4 md:mb-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">{exp.role}</h3>
                                        <div className="text-base md:text-lg font-medium text-foreground/70">{exp.company}</div>
                                    </div>
                                </div>
                                
                                <div className="text-muted-foreground text-sm md:text-base leading-relaxed space-y-3">
                                    {exp.description ? exp.description.split('\n').map((line: string, i: number) => (
                                        <p key={i} className="flex items-start gap-2">
                                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                            {line}
                                        </p>
                                    )) : <p>Professional contributions and project leadership.</p>}
                                </div>
                                
                                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex items-center text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                                    <span className="flex items-center group/link">
                                        Verified 
                                        <ChevronRight className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
