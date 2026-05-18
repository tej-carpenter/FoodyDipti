"use client";

import { useEffect, useState } from 'react';
import { predefinedTags } from '@/lib/mock-data';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  resultsCount: number;
  isSticky?: boolean;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  resultsCount,
  isSticky = false,
}: SearchFilterBarProps) {
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Track navbar visibility based on scroll direction
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Hide navbar when scrolling down
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setNavbarHidden(true);
        }
        // Show navbar when at top or scrolling up
        else if (currentScrollY < 50 || currentScrollY < lastScrollY) {
          setNavbarHidden(false);
        }

        setLastScrollY(currentScrollY);
      }, 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);
  return (
    <div
      className={`${
        isSticky
          ? `fixed left-0 right-0 z-20 border-b border-[rgba(31,31,31,0.06)] bg-[rgba(248,245,240,0.95)] shadow-[0_4px_12px_rgba(31,31,31,0.05)] backdrop-blur-md transition-all duration-300 ${
              navbarHidden ? 'top-0' : 'top-[70px]'
            }`
          : 'relative'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Search Input */}
          <div>
            <input
              type="text"
              placeholder="Search recipes by name or description..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-[rgba(31,31,31,0.1)] bg-white px-5 py-3 text-[var(--text)] placeholder-[var(--muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            />
            {searchQuery && (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Search results for &quot;{searchQuery}&quot; ({resultsCount} found)
              </p>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold tracking-[-0.02em] text-[var(--text)]">Filter by category</h3>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => onTagsChange([])}
                  className="text-xs text-[var(--accent)] transition hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() =>
                      onTagsChange(
                        active ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
                      )
                    }
                    className={`rounded-full px-3 py-1.5 text-sm transition-all duration-200 ease-out ${
                      active
                        ? 'bg-[var(--text)] text-white shadow-[0_10px_20px_rgba(31,31,31,0.06)]'
                        : 'bg-white text-[var(--text)] shadow-[0_8px_18px_rgba(31,31,31,0.04)] hover:-translate-y-0.5'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
