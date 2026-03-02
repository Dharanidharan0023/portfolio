import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useMousePosition from '../hooks/useMousePosition';

const AnimatedCursor = () => {
    const { x, y } = useMousePosition();
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseOver = (e) => {
            if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        return () => document.removeEventListener('mouseover', handleMouseOver);
    }, []);

    // Hide cursor on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null;
    }

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[100] mix-blend-difference"
                animate={{
                    x: x - 8,
                    y: y - 8,
                    scale: isHovering ? 2.5 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1
                }}
            />
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-primary/50 rounded-full pointer-events-none z-[99]"
                animate={{
                    x: x - 16,
                    y: y - 16,
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 0 : 1
                }}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 25,
                    mass: 0.5
                }}
            />
        </>
    );
};

export default AnimatedCursor;
