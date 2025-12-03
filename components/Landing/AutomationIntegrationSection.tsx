'use client'

import React, { memo } from 'react';
import { motion } from 'framer-motion';

const Container = ({ children, className = '' }) => (
    <div className={`container mx-auto px-6 md:px-8 lg:px-12 ${className}`}>
        {children}
    </div>
);


export const AutomationOrb = () => (
    <motion.div
        className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full z-0 pointer-events-none"
        initial={{ rotate: 0, opacity: 0.2, scale: 0.8 }}
        animate={{ 
            rotate: 360, 
            opacity: [0.2, 0.4, 0.2], 
            scale: [0.8, 0.9, 0.8] 
        }}
        transition={{
            rotate: { duration: 60, ease: "linear", repeat: Infinity },
            opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
    >
        <div className="w-full h-full border-2 border-black/30 rounded-full flex items-center justify-center">
            <div className="w-5/6 h-5/6 border-2 border-black/30 rounded-full" />
        </div>
    </motion.div>
);



const AnimatedPipelineCore = () => {

    const pathD = "M 50 20 C 50 150, 280 150, 280 250 S 50 350, 50 480";
   

    return (
        <div className="relative h-[550px] w-full flex justify-center items-center">
            {/* SVG Canvas for the path and animation */}
            <svg 
                viewBox="0 0 330 500" 
                className="absolute w-full h-full max-w-[350px] md:max-w-md mx-auto" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* The main pipeline path (dashed and subtle) */}
                <motion.path
                    d={pathD}
                    stroke="#787878" // Light gray for the path
                    strokeWidth="3"
                    strokeDasharray="10 10"
                    initial={{y: 0 }}
                    animate={{ y: 50 }}
                    transition={{ duration: .5, repeat: 10, repeatType: 'loop'}}
                    strokeLinecap="round"
                />

                {/* The flowing Data Packet (animated circle along the path) */}
                <motion.circle
                    cx="0" cy="0" r="10"
                    fill="#000000" // Black
                    // Animation applied directly to avoid Variant type conflicts
                    initial={{ pathOffset: 1 }}
                    animate={{ pathOffset: 0 }}
                    transition={{
                        duration: 10, // Duration of one full cycle
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop" // Now correctly inferred
                    }}
                    path={pathD}
                    className="shadow-xl shadow-black/50"
                >
                    {/* Inner pulse for the packet */}
                    <motion.circle
                        cx="0" cy="0" r="4"
                        fill="#FFFFFF"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.circle>

                {/* --- Stage Anchors (Fixed points along the path) --- */}
                {/* Anchor 1: Stage 1 (Top) */}
                <circle cx="50" cy="20" r="14" fill="white" stroke="#000000" strokeWidth="4" className="shadow-xl shadow-black/10" />
                {/* Anchor 2: Stage 2 (Middle Right) */}
                <circle cx="280" cy="250" r="14" fill="white" stroke="#000000" strokeWidth="4" className="shadow-xl shadow-black/10" />
                {/* Anchor 3: Stage 3 (Bottom) */}
                <circle cx="50" cy="480" r="14" fill="white" stroke="#000000" strokeWidth="4" className="shadow-xl shadow-black/10" />

            </svg>
        </div>
    );
};


// Static data for the stages
const automationSteps = [
    {
        id: 1,
        title: "Stage 1: Verified Content Generation",
        description: "Content is drafted using the two-stage refinement process. Outputs are verified against compliance and tone guides before processing.",
        position: 'top-left',
    },
    {
        id: 2,
        title: "Stage 2: Immutable Quality Assurance",
        description: "The draft enters the audit log. Real-time scanning checks for global regulatory adherence and source integrity.",
        position: 'center-right',
    },
    {
        id: 3,
        title: "Stage 3: Webhook Delivery & Scale",
        description: "A secure webhook payload is sent directly to your CMS (WordPress, Contentful, Custom API). Automate publishing.",
        position: 'bottom-left',
    }
];

// Main section component using the new Animated Pipeline
function AutomationIntegrationSection() {
    return (
      <section id="automation" className="bg-white py-24 md:py-32 overflow-hidden relative">
            
            {/* The Creative Automation Orb Background Element */}
            <AutomationOrb />

            <Container className="text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl md:text-6xl font-extrabold text-black tracking-tighter max-w-4xl mx-auto"
                >
                    Seamless Delivery. Integrated Intelligence.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-4 text-xl text-neutral-600 max-w-3xl mx-auto"
                >
                    The ThinkInk Automation Pipeline turns generated content into published assets without a single manual intervention.
                </motion.p>
            </Container>

            <Container className="mt-20 relative z-10">
                {/* This container sets the overall height for absolute children on desktop */}
                <div className="relative max-w-5xl mx-auto md:h-[550px]">

                    {/* Animation Core: Hidden on mobile (hidden), Visible & Centered on desktop (md:block) */}
                    <div className="hidden md:block md:absolute md:inset-0 md:flex md:justify-center md:items-center">
                        <AnimatedPipelineCore />
                    </div>

                    {/* Stage Content: Simple column flow on mobile, Absolute positioning on desktop */}
                    {/* On mobile, this div stacks all cards with gap-12 */}
                    <div className="flex flex-col gap-12">
                        {automationSteps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: step.position.includes('right') ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.7, delay: 0.1 * index }}
                                whileHover={{ scale: 1.02 }}
                                
                                className={`
                                    p-6 rounded-lg bg-white/90 backdrop-blur-sm border shadow-neutral-400 border-neutral-100 shadow-xl 
                                    
                                    mx-auto max-w-lg w-full text-left
                   
                                    md:absolute md:w-[350px] lg:w-[400px] md:mx-0
                                    
                                    ${step.position === 'top-left' ? 'md:top-0 md:left-0 md:text-right' : ''} 
                                    ${step.position === 'center-right' ? 'md:top-1/2 md:-translate-y-1/2 md:right-0 md:text-left' : ''} 
                                    ${step.position === 'bottom-left' ? 'md:bottom-0 md:left-0 md:text-right' : ''}
                                `}
                            >
                                <h3 className="text-xl md:text-2xl font-bold text-black">{step.title}</h3>
                                <p className="mt-2 text-sm text-neutral-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-20 pt-10 border-t border-neutral-100 text-center"
                >
                    <h3 className="text-3xl font-extrabold text-black">Integrate Your Stack. Scale Your Output.</h3>
                    <p className="mt-3 text-lg text-neutral-600">Connect to any modern CMS in minutes and move from draft to publish automatically.</p>
                    <button className="mt-6 bg-black text-white px-8 py-3 rounded-lg text-base font-semibold shadow-xl shadow-black/20 hover:bg-neutral-900 transform transition hover:-translate-y-0.5">
                        View API Documentation
                    </button>
                </motion.div>

            </Container>
        </section>
    );
}

export default memo(AutomationIntegrationSection);