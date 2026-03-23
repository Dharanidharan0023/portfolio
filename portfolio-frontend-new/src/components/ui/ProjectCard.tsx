'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, X, Copy, Check } from 'lucide-react';
import { Button } from './Button';
import { DevicePreview } from './DevicePreview';
import { AnimatePresence } from 'framer-motion';

interface ProjectCardProps {
    title: string;
    description: string;
    imageUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
    tags?: string[];
    index?: number;
}

export function ProjectCard({ title, description, imageUrl, liveUrl, githubUrl, tags = [], index = 0 }: ProjectCardProps) {
    const [showPreview, setShowPreview] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liveUrl) {
            navigator.clipboard.writeText(liveUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCardClick = () => {
        if (liveUrl) {
            window.open(liveUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={handleCardClick}
            className="group relative rounded-2xl md:rounded-3xl overflow-hidden glass border-border/50 hover:border-primary/50 transition-all flex flex-col h-full shadow-lg hover:shadow-xl dark:shadow-none bg-background/50 cursor-pointer"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={imageUrl || "/api/placeholder/800/450"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex flex-wrap gap-3">
                        {liveUrl && (
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="gap-2 bg-primary/90 hover:bg-primary">
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo
                                    </Button>
                                </a>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="gap-2 bg-background/50 backdrop-blur-md border-border"
                                    onClick={handleCopy}
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>
                        )}
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPreview(true);
                            }}
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Devices
                        </Button>
                        {githubUrl && (
                            <a href={githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                <Button variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-md border-border">
                                    <Github className="w-4 h-4" />
                                    Code
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col relative z-20">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-secondary/80 text-secondary-foreground text-[10px] uppercase font-bold tracking-wider border border-border/50">
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {description}
                </p>
            </div>
        </motion.div>

        {/* Device Preview Modal */}
        <AnimatePresence>
            {showPreview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setShowPreview(false)}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col no-scrollbar"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                                    {title}
                                </h2>
                                <p className="text-muted-foreground mt-2">Device Preview</p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full w-10 h-10 p-0"
                                onClick={() => setShowPreview(false)}
                            >
                                <X className="w-5 h-5" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>
                        
                        <div className="flex-1 w-full flex items-center justify-center py-10 bg-black/5 dark:bg-white/5 rounded-2xl border border-border/50">
                            <DevicePreview 
                                title={title}
                                laptopImage={imageUrl || "/api/placeholder/800/450"}
                                mobileImage={imageUrl || "/api/placeholder/400/800"} 
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        </>
    );
}
