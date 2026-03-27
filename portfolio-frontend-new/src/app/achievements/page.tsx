'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Trophy, Award, GraduationCap, Calendar, ExternalLink, BookmarkCheck, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

export default function AchievementsPage() {
    const [achievements, setAchievements] = React.useState<any[]>([]);
    const [educations, setEducations] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [achResponse, eduResponse] = await Promise.all([
                    api.get('/achievements/public'),
                    api.get('/educations/public')
                ]);
                setAchievements(achResponse.data);
                setEducations(eduResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
            </div>
        );
    }

    return (
        <div className="py-12 md:py-24 space-y-20 md:space-y-32 relative overflow-hidden">
             {/* Background accents */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

            {/* --- EDUCATION FLOW SECTION --- */}
            <Container>
                <div className="max-w-4xl mx-auto mb-12 md:mb-20 text-center md:text-left pt-12 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-4 md:mb-6 text-xs md:text-sm font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
                            Academic Foundation
                        </span>
                        <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-8 tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            Education Flow
                        </h1>
                        <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl px-4 md:px-0">
                            The chronological roadmap of my academic development and degree accomplishments.
                        </p>
                    </motion.div>
                </div>

                <div className="relative max-w-5xl mx-auto pl-4 md:pl-0">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 md:w-1 bg-gradient-to-b from-primary/50 via-border to-transparent md:-translate-x-1/2 block" />
                    
                    {educations.map((edu, index) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className={`relative flex flex-col md:flex-row items-center justify-between mb-12 md:mb-24 group ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        >
                            {/* Desktop Center Point */}
                            <div className="absolute left-0 md:left-1/2 w-3 md:w-4 h-3 md:h-4 rounded-full bg-background border-2 md:border-4 border-primary shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10 md:-translate-x-1/2 transition-transform duration-300 group-hover:scale-150" />

                            {/* Center-aligned Date Text (Desktop Only) */}
                            <div className={`hidden md:block w-[45%] ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                                <time className="text-2xl font-black text-muted-foreground group-hover:text-primary transition-colors duration-300">
                                    {new Date(edu.startDate).getFullYear()} — {new Date(edu.endDate).getFullYear()}
                                </time>
                                <p className="text-sm font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">
                                    Main Degree
                                </p>
                            </div>

                            {/* Card Content */}
                            <div className="w-full ml-8 md:ml-0 md:w-[45%] p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] glass-card border-white/5 group-hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 relative">
                                <div className="absolute top-6 md:top-8 right-6 md:right-8 w-10 md:w-12 h-10 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <GraduationCap className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                                </div>
                                <div className="md:hidden mb-2">
                                     <span className="text-[10px] font-bold text-primary tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded">
                                        {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                                    </span>
                                </div>
                                <div className="mb-4 md:mb-6">
                                    <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors pr-12">{edu.degree}</h3>
                                    <div className="text-base md:text-lg font-medium text-foreground/70 mt-1">{edu.institution}</div>
                                </div>
                                
                                <div className="text-muted-foreground text-sm md:text-base leading-relaxed space-y-3 pt-4 border-t border-white/5 italic">
                                    <p>{edu.description || "Pursued advanced technical concepts and research."}</p>
                                </div>
                                
                                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex items-center text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                                    <span className="flex items-center group/link">
                                        Verified Credential
                                        <ChevronRight className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>

            {/* --- ACHIEVEMENTS GRID SECTION --- */}
            <Container>
                <div className="max-w-4xl mx-auto mb-12 md:mb-20 text-center md:text-right md:ml-auto md:mr-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-4 md:mb-6 text-xs md:text-sm font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
                            Honors & Milestones
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-8 tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            Achievements & Skills
                        </h2>
                        <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl px-4 md:px-0 md:ml-auto">
                            Recognitions of professional excellence, technical certifications, and industry contribution milestones.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4 md:px-0">
                    {achievements.map((ach, index) => (
                        <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="h-full p-6 md:p-8 rounded-2xl md:rounded-[2rem] glass-card border-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6 md:mb-10">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 shadow-lg shadow-black/20">
                                            <Trophy className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl md:text-2xl font-black text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
                                                {new Date(ach.dateAchieved).getFullYear()}
                                            </div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                                Verified
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 leading-snug group-hover:text-primary transition-colors">{ach.title}</h3>
                                    <p className="text-muted-foreground text-xs md:text-sm flex-1 leading-relaxed mb-8 md:mb-10">
                                        {ach.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-secondary flex items-center justify-center">
                                                <BookmarkCheck className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                {ach.issuer || "Institution"}
                                            </span>
                                        </div>
                                        {ach.url && (
                                            <a
                                                href={ach.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-primary text-white hover:scale-110 transition-all shadow-lg shadow-primary/25"
                                            >
                                                <ExternalLink className="w-3 md:w-4 h-3 md:h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {achievements.length === 0 && (
                    <div className="text-center py-20 p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-border/50 bg-secondary/10 mx-4 md:mx-0">
                        <Award className="w-12 md:w-16 h-12 md:h-16 text-muted-foreground/30 mx-auto mb-4 md:mb-6" />
                        <p className="text-lg md:text-xl font-bold text-muted-foreground">Expansion in progress.</p>
                        <p className="text-xs md:text-sm text-muted-foreground/60 mt-2">New certifications will appear here shortly.</p>
                    </div>
                )}
            </Container>
        </div>
    );
}
