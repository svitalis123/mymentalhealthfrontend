// src/components/a11y/SkipLink.tsx
export const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-white p-4 z-50"
  >
    Skip to main content
  </a>
)