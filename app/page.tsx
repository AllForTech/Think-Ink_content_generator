import MonoHero from '@/components/Landing/MonoHero';
import MonoFeatures from '@/components/Landing/MonoFeatures';
import MonoTestimonials from '@/components/Landing/MonoTestimonials';
import MonoCTA from '@/components/Landing/MonoCTA';
import MonoFooter from '@/components/Landing/MonoFooter';
import { Navbar } from '@/components/Landing/Navbar';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Title that appears in the browser tab
  title: 'AI Content Generator | Two-Step Quality Pipeline',

  // Description used by search engines (Google, Bing)
  description:
    'Generate high-quality, grounded, and SEO-optimized content using our two-step AI refinement and generation process.',

  // Open Graph (OG) tags for social media sharing
  openGraph: {
    title: 'AI Content Generator - Refinement First',
    description:
      'The best way to generate content: refine your prompt for quality before generating the final article.',
    url: '',
    siteName: 'Content Pipeline MVP',
    images: [
      {
        url: '/asset/hero_image.png', // A custom image for sharing
        width: 1200,
        height: 630,
        alt: 'AI Content Generator App Screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter card details (important for X/Twitter shares)
  twitter: {
    card: 'summary_large_image',
    title: 'AI Content Generator | Two-Step Pipeline',
    description:
      'Stop generating low-quality content. Our process guarantees high-quality, grounded output.',
    creator: '@YourTwitterHandle',
    images: ['https://yourwebsite.com/og-image-generator.png'],
  },

  // Canonical URL (optional but recommended for SEO)
  alternates: {
    canonical: 'https://allfortech.org',
  },
};

export default function LandingPage() {
  return (
    <>
      <div
        className={cn(
          'screen center fixed! inset-0 top-0 -z-4 bg-linear-to-br from-white via-purple-400/28 to-white',
        )}
      />
      <div
        className="w-full overflow-hidden bg-transparent text-black backdrop-blur-2xl"
        id={'hide-scrollbar'}
      >
        {/* <Navbar /> */}
        <MonoHero />
        <MonoFeatures />
        <MonoTestimonials />
        <MonoCTA />
        <MonoFooter />
      </div>
    </>
  );
}
