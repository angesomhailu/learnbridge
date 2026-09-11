
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: "🎯",
    title: "Smart tutor matching",
    text: "Find tutors based on your subjects, goals, schedule, learning needs, and budget.",
  },
  {
    icon: "🛡️",
    title: "Safety comes first",
    text: "Verified tutor information, parent controls, and secure communication help create a safer learning environment.",
  },
  {
    icon: "💬",
    title: "Meaningful communication",
    text: "Connect with tutors and discuss learning needs before and during your sessions.",
  },
  {
    icon: "⭐",
    title: "Real tutor feedback",
    text: "Use ratings and reviews to make more informed decisions when choosing a tutor.",
  },
  {
    icon: "📈",
    title: "Track your progress",
    text: "Keep your learning journey organized and understand how you are progressing over time.",
  },
  {
    icon: "💰",
    title: "Learning within your budget",
    text: "Discover suitable tutors while keeping your preferred learning budget in mind.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#dfe3e8] text-slate-900 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute top-[30%] -right-40 h-[550px] w-[550px] rounded-full bg-indigo-200/15 blur-3xl" />
        <div className="absolute bottom-[-250px] left-[30%] h-[500px] w-[500px] rounded-full bg-blue-100/20 blur-3xl" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#f4f5f7] backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/learnbridge.png"
              alt="LearnBridge"
              width={46}
              height={46}
              className="h-11 w-11 object-contain"
              priority
            />

            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900">
                Learn<span className="text-blue-600">Bridge</span>
              </div>
              <div className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
                Learn better. Grow further.
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              How it works
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#safety"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Safety
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-md px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-24">
          {/* Left */}
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Smarter tutoring starts here
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find the right tutor.
              <span className="block text-blue-600">
                Learn with confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              LearnBridge helps students find tutors who fit their subjects,
              learning goals, schedule, and budget — while giving parents and
              learners greater confidence in the learning process.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                Find a Tutor
                <span className="ml-2">→</span>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                See how it works
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600">✓</span>
                Verified tutors
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600">✓</span>
                Smart matching
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600">✓</span>
                Parent controls
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative z-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-6">
              {/* Fake browser/header */}
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                </div>

                <div className="rounded-md bg-slate-100 px-4 py-1.5 text-xs text-slate-500">
                  learnbridge
                </div>

                <div className="h-7 w-7 rounded-full bg-blue-100" />
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student Dashboard
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Here is a tutor match selected for your learning needs.
                </p>
              </div>

              {/* Match card */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      Your tutor match
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      Recommended Tutor
                    </h3>
                  </div>

                  <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Verified
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-600 shadow-sm">
                    T
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      Mathematics & Physics
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Experienced tutor
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-white p-3 text-center">
                    <p className="text-lg font-bold text-blue-600">94%</p>
                    <p className="text-[10px] font-medium uppercase text-slate-500">
                      Match
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">4.9</p>
                    <p className="text-[10px] font-medium uppercase text-slate-500">
                      Rating
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">ETB</p>
                    <p className="text-[10px] font-medium uppercase text-slate-500">
                      Budget fit
                    </p>
                  </div>
                </div>

                <button className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                  View Tutor Match
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                <span className="text-green-600">●</span>
                Safe connection
              </div>
            </div>

            {/* Small floating card */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  ✓
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Tutor verified
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Ready to learn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAL LEARNING */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                Learning is personal
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your learning journey should work for you.
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-slate-600">
                Every student learns differently. LearnBridge brings students,
                parents, and tutors together through a platform designed around
                individual learning needs.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Whether you need help with mathematics, physics, languages, or
                another subject, you can discover tutors based on what matters
                most to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-[#eef1f5]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              A simpler way to find the right tutor.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              LearnBridge makes the process straightforward, from creating your
              profile to finding a tutor who fits your needs.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Tell us what you need",
                text: "Create your learner profile and tell us about your subjects, goals, schedule, and preferred budget.",
              },
              {
                number: "02",
                title: "Discover your matches",
                text: "Explore tutors who match your learning requirements and compare their profiles, ratings, and experience.",
              },
              {
                number: "03",
                title: "Start learning",
                text: "Connect with your tutor, arrange sessions, communicate safely, and continue building your learning progress.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  {step.number}
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Why LearnBridge
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Built around better learning
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Everything you need to make tutoring more accessible, organized,
              and personalized.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section id="safety" className="scroll-mt-20 bg-[#eef1f5]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50">
            <div className="grid gap-10 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-12">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white">
                  🛡️
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                  Safety first
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  A learning environment built with trust in mind.
                </h2>
              </div>

              <div>
                <p className="text-lg leading-8 text-slate-700">
                  LearnBridge is designed to help students, parents, and tutors
                  interact with greater confidence.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {[
                    "Tutor verification",
                    "Parent controls",
                    "Secure communication",
                    "Ratings and reviews",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-blue-100 bg-white px-4 py-3"
                    >
                      <span className="font-bold text-blue-600">✓</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to make learning more personal?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Create your LearnBridge account and take the next step toward
            finding the right learning support.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-md bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-md border border-blue-300 bg-blue-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/learnbridge.png"
                alt="LearnBridge"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />

              <div>
                <p className="font-bold text-slate-900">
                  Learn<span className="text-blue-600">Bridge</span>
                </p>

                <p className="text-xs text-slate-500">
                  Learn better. Grow further.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <a
                href="#"
                className="transition hover:text-blue-600"
              >
                Privacy
              </a>

              <a
                href="#"
                className="transition hover:text-blue-600"
              >
                Terms
              </a>

              <a
                href="#"
                className="transition hover:text-blue-600"
              >
                Support
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 md:text-left">
            © {new Date().getFullYear()} LearnBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
