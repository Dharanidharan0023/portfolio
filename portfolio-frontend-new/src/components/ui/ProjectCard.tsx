'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Button } from './Button';

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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl overflow-hidden glass hover:border-primary/50 transition-all flex flex-col h-full"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={imageUrl || "/api/placeholder/800/450"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex gap-4">
                        {liveUrl && (
                            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" className="gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                </Button>
                            </a>
                        )}
                        {githubUrl && (
                            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Github className="w-4 h-4" />
                                    Code
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
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
    );
}
