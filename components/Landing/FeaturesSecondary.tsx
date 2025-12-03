'use client';

import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { Container } from "./AutomationIntegrationSection";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SECONDARY_FEATURES = [
    {
        id: 0,
        title: "Model Hub Integration: Cross-Platform AI",
        text: "Seamlessly integrate third-party LLMs like Gemini, GPT, or Claude. Run multi-model comparisons and fuse results to achieve superior output quality and redundancy. One prompt, infinite engines.",
        diagramTitle: "Multi-Model Fusion",
    },
    {
        id: 1,
        title: "Custom Model Fine-Tuning Environment",
        text: "Leverage your proprietary data to fine-tune specialized models within the Think-Ink platform. Deploy custom content generators tailored to your unique brand voice, terminology, and compliance needs.",
        diagramTitle: "Proprietary Data Ingestion",
    },
    {
        id: 2,
        title: "Real-time Latency & Cost Optimization",
        text: "Our intelligent routing layer dynamically selects the most cost-effective and low-latency API endpoint for every request. Optimize performance without manual configuration or vendor lock-in concerns.",
        diagramTitle: "Dynamic Routing Layer",
    },
];

// Visual Component: Animated SVG for Model Hub
const AnimatedModelHub = memo(({ currentIndex }: { currentIndex: number }) => {
    // Define positions for the three nodes (Model A, B, C)
    const nodePositions = [
        { x: 30, y: 100 }, // Model A (Gemini)
        { x: 270, y: 100 }, // Model B (GPT)
        { x: 150, y: 280 }, // Model C (Custom)
    ];
    
    // Determine which node is active
    const isActive = (index) => currentIndex === index;

    // Line drawing variants for the central core connections
    const lineVariants = (index) => ({
        initial: { pathLength: 0, opacity: 0.5, stroke: "#374151" }, // Neutral gray
        active: { 
            pathLength: 1, 
            opacity: 1, 
            stroke: "#000000", // Black for active
            transition: { duration: 0.5, ease: "easeInOut" } 
        },
        inactive: { pathLength: 0.2, opacity: 0.4, stroke: "#6B7280" } // Faded when not active
    });

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center bg-transparent  p-1.5 pb-10!">
            <svg viewBox="0 0 300 300" className="w-full h-full pb-10!">
                {/* Central Think-Ink Core Node */}
                <circle cx="150" cy="150" r="28" fill="#000000" className="shadow-2xl shadow-black/50" />
                <text x="150" y="155" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">TI</text>
                {/* <text x="150" y="180" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="500">CORE</text> */}

                {/* Connection Lines */}
                {nodePositions.map((pos, index) => {
                    const status = isActive(index) ? 'active' : 'inactive';
                    return (
                        <motion.path
                            key={index}
                            d={`M ${pos.x} ${pos.y} L 150 150`}
                            variants={lineVariants(index)}
                            initial="initial"
                            animate={status}
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="transition-colors duration-500"
                        />
                    );
                })}

                {/* Nodes (Models) */}
                {nodePositions.map((pos, index) => (
                    <motion.g 
                        key={index} 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ 
                            scale: isActive(index) ? 1.1 : 0.9, 
                            opacity: isActive(index) ? 1 : 0.7 
                        }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className={'container-fit overflow-visible!'}
                    >
                        <circle 
                            cx={pos.x} 
                            cy={pos.y} 
                            r="20" 
                            fill={isActive(index) ? '#000000' : '#FFFFFF'} 
                            stroke="#000000" 
                            strokeWidth="2"
                            className="shadow-md"
                        />
                        <text 
                            x={pos.x} 
                            y={pos.y + 4} 
                            textAnchor="middle" 
                            fill={isActive(index) ? '#FFFFFF' : '#000000'} 
                            fontSize="10" 
                            fontWeight="bold"
                        >
                            {index === 0 && 'G-AI'}
                            {index === 1 && 'GPT'}
                            {index === 2 && 'CUST'}
                        </text>
                        <text 
                            x={pos.x} 
                            y={pos.y + 48} 
                            scale={.8}
                            textAnchor="middle" 
                            fill="#000000" 
                            fontSize="9" 
                            fontWeight="300"
                            className={cn('mt-10 z-10! overflow-visible! container-fit!',isActive(index) ? 'font-bold text-xs!' : 'font-semibold text-xs!')}
                        >
                            {SECONDARY_FEATURES[index].diagramTitle}
                        </text>
                    </motion.g>
                ))}
            </svg>
        </div>
    );
});


const FeaturesSecondary = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentFeature = SECONDARY_FEATURES[currentIndex];
    const delay = 5000; // 6 seconds

    // Content rotation loop
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                (prevIndex + 1) % SECONDARY_FEATURES.length
            );
        }, delay);

        return () => clearInterval(timer);
    }, []);

    // Animation variants for the text content
    const textVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
        exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
    };

    return (
        <section id="secondary-features" className='w-full bg-white'>
             <Container className='py-20 center flex-col md:py-30'>
                 <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-extrabold text-black tracking-tighter mb-8 lg:mb-12"
                        >
                            The Next Generation of Content Engine.
                        </motion.h2>

                <div className='flex flex-col lg:flex-row space-y-12 lg:space-y-0 lg:space-x-22!'>
                    
                    {/* LEFT SIDE: Text Content (Features) */}
                        <div className='w-full flex h-full flex-col lg:pt-25! max-w-2xl mx-auto lg:mx-0'>
                    

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFeature.id}
                                variants={textVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className='space-y-4 p-5 h-fit shadow-md shadow-neutral-500 rounded-md pb-10 bg-black'
                            >
                                <div className='p-2 rounded-full border border-black/10 text-white w-fit text-sm font-semibold'>
                                    Phase {currentFeature.id + 1}
                                </div>
                                <h3 className='text-3xl font-bold text-white'>{currentFeature.title}</h3>
                                <p className='text-sm lg:text-md text-neutral-300'>{currentFeature.text}</p>
                            </motion.div>
                        </AnimatePresence>

                        <motion.div
                             initial={{ opacity: 0, y: 10 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true, amount: 0.5 }}
                             transition={{ duration: 0.6, delay: 0.8 }}
                             className='mt-15'
                        >
                             <Link href="/learn-more">
                                <Button className="bg-black text-white px-6 py-6 rounded-md text-base font-semibold shadow-xl shadow-black/20 hover:bg-neutral-900 transform transition hover:-translate-y-0.5">
                                    Deep Dive into the Hub
                                </Button>
                             </Link>
                        </motion.div>
                    </div>
                    

                    {/* RIGHT SIDE: Sophisticated Animated Diagram */}
                    <div className='w-full lg:w-1/3 h-full flex items-center overflow-visible p-10 justify-center lg:pl-8'>
                        <AnimatedModelHub currentIndex={currentIndex} />
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default memo(FeaturesSecondary);
