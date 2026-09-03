import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-300px] left-[-200px] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-[400px] right-[-250px] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Image
                src="/learnbridge.png"
                alt="LearnBridge Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div>
              <span className="block font-bold text-xl tracking-tight text-white">
                LearnBridge
              </span>
              <span className="hidden sm:block text-[9px] text-slate-500 tracking-widest uppercase">
                Learn • Connect • Grow
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="#features"
              className="hover:text-white transition-colors"
            >
              Why LearnBridge
            </a>
            <a
              href="#safety"
              className="hover:text-white transition-colors"
            >
              Safety
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-2 text-xs font-medium text-indigo-300 mb-7">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Smarter tutoring starts here
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-white">
                  Find the right tutor.
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Learn with confidence.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
                  LearnBridge helps students find qualified tutors who match
                  their subjects, schedule, learning goals, and budget — while
                  giving parents the safety and control they deserve.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-7 py-3.5 rounded-xl font-semibold text-white shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                  >
                    Find a Tutor
                    <span>→</span>
                  </Link>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-7 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white transition-all"
                  >
                    See how it works
                  </a>
                </div>

                {/* Trust points */}
                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Verified tutors
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Smart matching
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Parent controls
                  </span>
                </div>
              </div>

              {/* Right - Humanized visual */}
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-2xl" />

                <div className="relative rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-5 shadow-2xl">
                  {/* Fake dashboard header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold">
                        A
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Welcome back 👋
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Let's keep learning
                        </p>
                      </div>
                    </div>

                    <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>

                  <div className="py-6">
                    <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                      Your tutor match
                    </p>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-lg font-bold">
                          T
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">
                              Recommended Tutor
                            </p>
                            <span className="text-[9px] rounded-full bg-green-500/10 text-green-400 px-2 py-1">
                              VERIFIED
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1">
                            Mathematics • Physics
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-5">
                        <div className="rounded-xl bg-slate-900 p-3 text-center">
                          <p className="text-lg font-bold text-white">94%</p>
                          <p className="text-[9px] text-slate-500">
                            Match
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-900 p-3 text-center">
                          <p className="text-lg font-bold text-white">4.9</p>
                          <p className="text-[9px] text-slate-500">
                            Rating
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-900 p-3 text-center">
                          <p className="text-lg font-bold text-white">ETB</p>
                          <p className="text-[9px] text-slate-500">
                            Budget fit
                          </p>
                        </div>
                      </div>

                      <button className="mt-5 w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white">
                        View Tutor Match
                      </button>
                    </div>
                  </div>

                  {/* Small notification */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center">
                      ✓
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Safe connection
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Your tutor request was accepted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HUMAN MESSAGE */}
        <section className="border-y border-slate-900 bg-slate-900/20">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <p className="text-sm font-semibold text-indigo-400">
              LEARNING IS PERSONAL
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
              Because every student learns differently.
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-slate-400 leading-7">
              Some students need help preparing for an exam. Others need
              someone to explain a difficult topic one more time. LearnBridge
              helps connect each learner with a tutor who fits their needs.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-14">
              <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">
                Simple from the start
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
                Your learning journey, made easier.
              </h2>

              <p className="mt-4 text-slate-400 leading-7">
                From finding a tutor to completing your lessons, LearnBridge
                keeps the experience simple and transparent.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  number: "01",
                  icon: "🎯",
                  title: "Tell us what you need",
                  description:
                    "Choose your subjects, grade level, learning goals, schedule, and budget.",
                },
                {
                  number: "02",
                  icon: "🤝",
                  title: "Meet your best matches",
                  description:
                    "Our matching system recommends tutors based on what actually matters to you.",
                },
                {
                  number: "03",
                  icon: "📚",
                  title: "Learn and grow",
                  description:
                    "Schedule lessons, communicate with your tutor, track progress, and give feedback.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-7 hover:bg-slate-900/70 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">
                      {item.number}
                    </span>

                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                  </div>

                  <h3 className="mt-8 text-lg font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">
                Why LearnBridge
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
                More than just finding a tutor.
              </h2>

              <p className="mt-4 text-slate-400 leading-7">
                We designed LearnBridge around the people who matter most:
                students, tutors, and families.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-7">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl">
                  🤖
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Smart tutor matching
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-6">
                  Find tutors based on subject expertise, availability,
                  pricing, ratings, and your personal learning needs.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-7">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-xl">
                  🛡️
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Safety comes first
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-6">
                  Verified tutors, age-based protections, parent oversight,
                  and controlled communication help create a safer learning
                  environment.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-7">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl">
                  💬
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Meaningful communication
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-6">
                  Students and tutors can communicate through structured
                  conversations after a tutoring connection is established.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-7">
                <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl">
                  ⭐
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Real tutor feedback
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-6">
                  Students can review completed tutoring sessions, helping
                  future learners make better decisions.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-7">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xl">
                  📈
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Track your progress
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-6">
                  Keep your learning goals, assessments, progress records,
                  and tutoring history in one place.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-7">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-xl">
                  💰
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Learning within your budget
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-6">
                  Set a budget and discover tutors whose pricing fits your
                  learning plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SAFETY */}
        <section id="safety" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-900/50 to-slate-950 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl">
                    🛡️
                  </div>

                  <h2 className="mt-6 text-3xl font-bold text-white">
                    A safer way to connect.
                  </h2>

                  <p className="mt-4 text-slate-400 leading-7">
                    Learning should feel comfortable for students and
                    reassuring for parents. LearnBridge builds safety into the
                    experience instead of treating it as an afterthought.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    "Tutor verification before student connections",
                    "Parent involvement for younger students",
                    "Controlled messaging between students and tutors",
                    "Transparent tutor ratings and reviews",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                    >
                      <span className="h-6 w-6 shrink-0 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-xs">
                        ✓
                      </span>

                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-indigo-500/20">
              <Image
                src="/learnbridge.png"
                alt="LearnBridge"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>

            <h2 className="mt-7 text-3xl md:text-4xl font-bold text-white">
              Ready to make learning easier?
            </h2>

            <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-7">
              Whether you are a student looking for guidance, a parent looking
              for support, or a tutor ready to help others learn — LearnBridge
              is here to connect you.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-7 py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all"
              >
                Create Your Account
              </Link>

              <Link
                href="/login"
                className="border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-7 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Clickable LearnBridge Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="h-9 w-9 rounded-full overflow-hidden">
                <Image
                  src="/learnbridge.png"
                  alt="LearnBridge Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                  LearnBridge
                </p>

                <p className="text-[10px] text-slate-600">
                  Learn • Connect • Grow
                </p>
              </div>
            </Link>

            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>

              <Link
                href="/support"
                className="hover:text-white transition-colors"
              >
                Support
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} LearnBridge. Built to make learning
            more accessible, personal, and safe.
          </div>
        </div>
      </footer>
    </div>
  );
}