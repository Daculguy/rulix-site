// Layout.tsx — top nav + footer shell around all routed pages.

import { useEffect, type ReactNode } from "react";

export function Brand({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
        <rect width="32" height="32" rx="2" fill="var(--accent)" />
        <path d="M16 5l9 4v6c0 5.5-3.8 9.7-9 11-5.2-1.3-9-5.5-9-11V9l9-4z" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M11.5 16.2l3 3 6-6.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <strong className="text-[17px] tracking-tight">Rulix</strong>
    </span>
  );
}

const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/#review-loop", label: "Review loop" },
  { href: "/#trust", label: "Trust" },
];

export function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll-reveal for any element carrying .reveal.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("vis")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-line-soft bg-bg/85 backdrop-blur">
        <div className="wrap flex h-[62px] items-center justify-between">
          <a href="/" aria-label="Rulix home"><Brand /></a>
          <nav className="flex items-center gap-7 text-[13.5px] font-medium text-text-2 max-md:gap-4">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-text-1 max-sm:hidden">
                {n.label}
              </a>
            ))}
            <a href="/#request-access" className="btn primary !py-2 !text-[13px]">Request access</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line-soft bg-bg-2">
        <div className="wrap grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Brand size={24} />
            <p className="footnote mt-4 max-w-[44ch]">
              Rulix is decision-support software for export-control review teams. It never issues
              final ECCN, license, sanctions, or jurisdiction determinations — a qualified human
              reviewer always decides.
            </p>
          </div>
          <div className="text-[13.5px]">
            <h4 className="mb-3 text-[12px] uppercase tracking-[0.1em] text-text-3">Product</h4>
            <ul className="m-0 list-none space-y-2 p-0 text-text-2">
              <li><a href="/#product" className="hover:text-text-1">Product overview</a></li>
              <li><a href="/#review-loop" className="hover:text-text-1">Review loop</a></li>
              <li><a href="/#/security" className="hover:text-text-1">Security &amp; data handling</a></li>
            </ul>
          </div>
          <div className="text-[13.5px]">
            <h4 className="mb-3 text-[12px] uppercase tracking-[0.1em] text-text-3">Company</h4>
            <ul className="m-0 list-none space-y-2 p-0 text-text-2">
              <li><a href="/#/legal" className="hover:text-text-1">Legal &amp; disclaimer</a></li>
              <li><a href="/#/contact" className="hover:text-text-1">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line-soft py-5">
          <p className="wrap footnote m-0">
            © {new Date().getFullYear()} Rulix. Research-grade prototype. Sanitized, public, or
            approved input only — do not submit CUI, ITAR technical data, or other controlled information.
          </p>
        </div>
      </footer>
    </div>
  );
}
