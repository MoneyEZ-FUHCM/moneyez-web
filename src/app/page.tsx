"use client";

import {
  BackgroundIntro,
  Comments,
  Functions,
  Packages,
  Reasons,
  ScrollReveal,
  Statistic,
  Supporter,
} from "@/components";

export default function Home() {
  return (
    <main className="container mx-auto select-none transition-all duration-500">
      <Supporter />
      <ScrollReveal>
        <Reasons />
      </ScrollReveal>
      <ScrollReveal>
        <Functions />
      </ScrollReveal>
      <ScrollReveal>
        <Statistic />
      </ScrollReveal>
      <ScrollReveal>
        <Comments />
      </ScrollReveal>
      <ScrollReveal>
        <Packages />
      </ScrollReveal>
      <ScrollReveal>
        <BackgroundIntro />
      </ScrollReveal>
      {/* <ScrollReveal>
        <FormContact />
      </ScrollReveal> */}
    </main>
  );
}
