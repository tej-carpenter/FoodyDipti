'use client';

import Link from 'next/link';

function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10v5" />
      <path d="M8 8.2v.1" />
      <path d="M11 15v-2.7c0-1.4.8-2.3 2-2.3 1.3 0 2 .9 2 2.3V15" />
      <path d="M15 12v3" />
    </svg>
  );
}

export default function AboutPage() {
  /* eslint-disable react/no-unescaped-entities */
  const testimonials = [
    {
      quote: 'Actually easy to follow.',
      author: 'Sarah',
    },
    {
      quote: 'Saved me during hostel cooking.',
      author: 'Priya',
    },
    {
      quote: 'Looks aesthetic AND tastes good.',
      author: 'Maya',
    },
  ];

  const features = [
    {
      title: 'QUICK & EASY',
      description: 'Meals that don\'t consume your entire evening.',
    },
    {
      title: 'CAFÉ-STYLE AT HOME',
      description: 'Restaurant-style comfort made approachable.',
    },
    {
      title: 'HEALTHY & BALANCED',
      description: 'Nutrition that tastes genuinely good.',
    },
    {
      title: 'SAVE-WORTHY',
      description: 'Recipes you\'ll return to again and again.',
    },
  ];

  return (
    <div className="space-y-12 bg-[var(--background)]">
      {/* SECTION 1 - HERO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Welcome to FoodyDipti</p>
            <h1 className="text-5xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--text)] sm:text-6xl">
              Cooking made simple, beautiful & worth saving
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              An editorial café platform celebrating approachable, café-inspired recipes that don\'t overwhelm. Every recipe is tested, treasured, and ready to become your new favorite.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              Browse Recipes
            </Link>
            <Link
              href="/profile"
              className="rounded-full border border-[var(--accent)]/30 px-8 py-3 text-sm font-medium text-[var(--accent)] transition-all duration-200 hover:bg-[var(--accent)]/5 hover:-translate-y-0.5"
            >
              Follow Updates
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 - WHO IS DIPTI */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 items-center md:grid-cols-2">
          <div className="relative h-96 w-full rounded-[2rem] bg-gradient-to-br from-[rgba(198,138,43,0.1)] to-[rgba(217,119,6,0.05)]">
            <img
              src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop"
              alt="Dipti cooking"
              className="h-full w-full rounded-[2rem] object-cover"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">About the Creator</p>
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--text)]">
                Meet Dipti
              </h2>
            </div>
            <p className="text-base leading-relaxed text-[var(--muted)]">
              FoodyDipti started from a simple belief: cooking doesn\'t have to be complicated. After years of testing recipes and learning what actually works in a real kitchen, I created a space where food is approachable, beautiful, and worth your time.
            </p>
            <p className="text-base leading-relaxed text-[var(--muted)]">
              Every recipe here has been personally tested and refined. I focus on café-inspired comfort meals-the kind you crave, the kind that impress, and the kind you\'ll want to save forever.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 - WHAT YOU'LL FIND */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Our Philosophy</p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--text)]">
              What You\'ll Find Here
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-[0_10px_20px_rgba(31,31,31,0.05)]"
              >
                <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - WHY FOODYDIPTI EXISTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[var(--text)] px-8 py-12 text-white sm:px-12">
          <div className="max-w-2xl space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.34em] text-white/60">The Problem We Solve</p>
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em]">
                Food blogs can be overwhelming
              </h2>
            </div>
            <p className="text-base leading-relaxed text-white/80">
              Between endless scrolling, life stories, ads, and recipes that require 15 specialty ingredients, finding a good meal has become exhausting. FoodyDipti strips away the noise and focuses on what matters: recipes that are genuinely easy, genuinely delicious, and genuinely worth your time.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 - FEATURED LIFESTYLE GALLERY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Visual Story</p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--text)]">
              From kitchen to plate
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { h: 'h-64', label: 'Fresh ingredients' },
              { h: 'h-96 sm:col-span-2', label: 'Plating moments' },
              { h: 'h-64', label: 'Coffee breaks' },
              { h: 'h-80 lg:col-span-2', label: 'Café-style dishes' },
              { h: 'h-64', label: 'Dessert close-ups' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${item.h} rounded-[1.75rem] bg-gradient-to-br from-[rgba(198,138,43,0.08)] to-[rgba(217,119,6,0.06)] shadow-[0_10px_20px_rgba(31,31,31,0.05)]`}
              >
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-[var(--muted)]">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - COMMUNITY / AUDIENCE LOVE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Community</p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--text)]">
              What people love about FoodyDipti
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-[0_10px_20px_rgba(31,31,31,0.05)]"
              >
                <p className="text-base leading-7 text-[var(--text)]">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-[var(--muted)]">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 - ABOUT THE PLATFORM */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-[1.75rem] bg-[var(--surface)] p-8 shadow-[0_10px_20px_rgba(31,31,31,0.05)]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Platform</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">
              Built with care
            </h3>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted)]">Built with</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                <li>Next.js 15</li>
                <li>Firebase (Auth, Firestore, Storage)</li>
                <li>Tailwind CSS 4</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted)]">Developed by</p>
              <div className="mt-3 flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--text)]">Tej</p>
                <a href="https://www.linkedin.com/in/tej-prakash-carpenter/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition">
                  <IconLinkedIn className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">Platform architect &amp; developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 - FINAL CTA */}
      <section className="mx-auto max-w-2xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-[2rem] bg-[var(--accent-secondary)] px-8 py-12 text-center shadow-[0_14pt_35px_rgba(31,31,31,0.08)] sm:px-12">
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-white">
            Ready to discover your next comfort meal?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--accent-secondary)] shadow-[0_10px_20px_rgba(31,31,31,0.1)] transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore Recipes
            </Link>
            <Link
              href="/profile"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
            >
              Save Your Favorites
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
