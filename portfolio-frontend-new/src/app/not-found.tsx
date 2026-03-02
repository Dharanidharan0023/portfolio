import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center animate-in">
            <Container className="text-center">
                <h1 className="text-9xl font-extrabold text-primary/20 mb-4">404</h1>
                <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link href="/">
                    <Button size="lg" className="gap-2">
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Button>
                </Link>
            </Container>
        </div>
    );
}
