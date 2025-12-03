'use client'

import React, { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Button} from '@/components/ui/button';
import refinePromptImage from '@/assets/refine-prompt.png'
import generatedContentImage from '@/assets/generated-content.png';
import webhookImage from '@/assets/webhook-dialog.png';
import Image from 'next/image'
import { cn } from '@/lib/utils';


const features = [
    {
      id: 'f1',
      title: 'Two-Stage Refinement Pipeline',
      desc: 'Precision starts upstream. Refine prompt parameters before execution to ensure superior content grounding.',
      fullDescription: 'Our proprietary dual-stage system separates conceptual alignment from final drafting. Stage 1 focuses on filtering and optimizing the prompt payload based on historical performance and compliance metrics. This rigorous upstream vetting results in cleaner, more targeted content output from Stage 2.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M12 11l0 5"></path>
          <path d="M9 13l6 0"></path>
        </svg>
      ),
      contents: [
        {
          image: refinePromptImage,
        }
      ],
    },
    {
      id: 'f2',
      title: 'Automated Compliance Checks',
      desc: 'Instant, automated checks for tone consistency, citation integrity, length compliance, and SEO alignment.',
      fullDescription: 'Every generated document passes through an automated quality gate. This includes real-time validation against predefined metrics for SEO density, brand tone, and legal compliance (e.g., source attribution). Publish with absolute confidence, knowing your content is checked and verified.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      ),
       contents: [
        {
          image: generatedContentImage,
        }
      ],
    },
    {
      id: 'f3',
      title: 'Webhooks & API Integration',
      desc: 'Deliver content automatically and securely to your CMS or preferred publishing platform via robust webhooks.',
      fullDescription: 'Integrate ThinkInk into your existing content stack via our secure, API-first architecture. Configure custom webhooks to trigger content delivery, approval flows, or archival processes instantly upon generation completion, achieving full operational automation.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="16 3 12 7 8 3"></polyline>
        </svg>
      ),
       contents: [
        {
          image: webhookImage,
        }
      ],
    }
  ];

function Features() {
  const [selectedFeature, setSelectedFeature] = React.useState(features[0]);



  const handleCardClick = (feature) => {
    setSelectedFeature(selectedFeature?.id === feature.id ? null : feature);
  };

  const featureRevealVariants = {
    hidden: { opacity: 0, height: 0, scaleY: 0.95 },
    visible: { 
      opacity: 1, 
      height: "auto", 
      scaleY: 1, 
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } 
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      paddingTop: 0,
      paddingBottom: 0,
      transition: { duration: 0.3, ease: "easeOut" } 
    }
  };

  return (
    <section id="features" className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 text-center md:text-left">
        <div className="max-w-4xl mx-auto md:mx-0">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }} 
            className="text-5xl md:text-6xl center font-extrabold text-black tracking-tighter"
          >
            Power Engineered for Content Mastery.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }} 
            className="mt-4 max-w-xl center text-xl text-neutral-700"
          >
            Everything you need to produce polished content quickly reliability without the noise.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div id='hide-scrollbar' className="mt-20 w-full flex justify-start p-5 overflow-y-auto md:overflow-y-hidden md:grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div 
              key={f.id} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }} 
              onClick={() => handleCardClick(f)}
              role="button"
              aria-expanded={selectedFeature?.id === f.id} 
              className={`relative bg-white border group w-full rounded-2xl p-8 cursor-pointer hover:bg-black hover:text-white! transition-all duration-300 transform 
                ${selectedFeature?.id === f.id ? 'border-black bg-black! shadow-2xl shadow-black/20' : ' hover:border-black/50 shadow-neutral-400 shadow-lg hover:shadow-xl hover:shadow-neutral-200'}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Icon Wrapper (Sleek Border) */}
                <div className={cn("p-3 rounded-full group-hover:text-white! border border-black/10 text-black",
                  selectedFeature?.id === f.id && 'text-white'
                )}>
                  {f.icon}
                </div>
                
                <div className={cn("text-xl font-semibold group-hover:text-white! text-black",
                  selectedFeature?.id === f.id && 'text-white'
                )}>{f.title}</div>
              </div>
              
              <p className={cn('my-5 text-neutral-600 group-hover:text-white! text-base',
                selectedFeature?.id === f.id && 'text-white'
              )}>{f.desc}</p>

              <div className="mt-6 text-sm group-hover:text-white! font-medium flex items-center gap-2 text-black transition-all">
                {selectedFeature?.id === f.id ? '' : 'Click to reveal →'}
              </div>
            </motion.div>
          ))}
        </div>

        {/* === Full Description Reveal Section === */}
        <AnimatePresence>
          {selectedFeature && (
            <motion.div
              key={selectedFeature.id}
              variants={featureRevealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-16 overflow-hidden origin-top"
            >
              <div className="bg-black p-8 md:p-12 rounded-2xl gap-3 shadow-2xl shadow-black/20 border-2 border-black/20 relative">
                
                <div className="flex items-center gap-4 border-b border-neutral-100 pb-4 mb-6">
                  <div className="p-4 rounded-xl bg-black text-white flex items-center justify-center shadow-lg">
                    {selectedFeature.icon}
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">
                    {selectedFeature.title}
                  </h3>
                </div>

                <motion.p 
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: 'linear'}}
                className="text-sm md:text-lg text-neutral-300 leading-relaxed">
                  {selectedFeature.fullDescription}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: 500}}
                  animate={{ opacity: 1, x: 0}}
                  transition={{ duration: 1, ease: 'backInOut' }}
                  className={cn('w-full min-h-auto my-10! overflow-hidden rounded-lg bg-neutral-700')}
                >
                   <Image
                  src={selectedFeature.contents[0].image}
                  alt="Secondary layered detail"
                  width={1300}
                  height={650}
                  // Using lower opacity to simulate depth and avoid visual clutter
                  className="w-full h-auto object-cover z-10 opacity-70" 
                />
                </motion.div>

                {/* Closing Button */}
                <div className="mt-8 w-full between">
                   <Button 
                    className="bg-neutral-100 text-neutral-800 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-neutral-200 transition"
                  >
                    View Documentation
                  </Button>

                  <Button 
                    onClick={() => setSelectedFeature(null)} 
                    className="bg-neutral-100 text-neutral-800 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-neutral-200 transition"
                  >
                    Close Description
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


export default memo(Features)