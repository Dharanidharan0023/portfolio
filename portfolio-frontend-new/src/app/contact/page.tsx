'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Mail, Send, CheckCircle2, Github, Linkedin, Code2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Note: Backend POST might be protected, but we'll try it as requested
            await api.post('/Contacts', data);
            setIsSuccess(true);
            reset();
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (err: any) {
            console.error('Submission error:', err);
            setError('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-20 animate-in">
            <Container>
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl font-extrabold mb-6">Get in Touch</h1>
                    <p className="text-xl text-muted-foreground">
                        Have a project in mind or just want to say hi? Feel free to reach out!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Email</h3>
                                <p className="text-muted-foreground">ksdharanidharan2005@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Code2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">GitHub</h3>
                                <a href="https://github.com/Dharanidharan0023" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    Dharanidharan0023
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Linkedin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">LinkedIn</h3>
                                <a href="https://linkedin.com/in/dharanidharan-k0023" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    in/dharanidharan-k0023
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            layout
                            className="p-8 rounded-3xl glass border border-border/50"
                        >
                            {isSuccess ? (
                                <div className="py-12 text-center space-y-4">
                                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                                    <h3 className="text-2xl font-bold">Message Sent!</h3>
                                    <p className="text-muted-foreground">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                                    <Button variant="outline" onClick={() => setIsSuccess(false)}>Send another message</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Name</label>
                                            <Input
                                                placeholder="Your Name"
                                                {...register('name')}
                                                className={errors.name ? 'border-red-500 ring-red-500' : ''}
                                            />
                                            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <Input
                                                type="email"
                                                placeholder="your@email.com"
                                                {...register('email')}
                                                className={errors.email ? 'border-red-500 ring-red-500' : ''}
                                            />
                                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input
                                            placeholder="What is this about?"
                                            {...register('subject')}
                                            className={errors.subject ? 'border-red-500 ring-red-500' : ''}
                                        />
                                        {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message</label>
                                        <Textarea
                                            placeholder="Tell me more..."
                                            {...register('message')}
                                            className={errors.message ? 'border-red-500 ring-red-500' : ''}
                                        />
                                        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                                    </div>

                                    {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
