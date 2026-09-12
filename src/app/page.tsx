
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
    <main className="min-h-screen bg-[#f0f4f8] text-slate-900 font-sans flex flex-col justify-between">
      {/* ================= NETACAD TOP HEADER ================= */}
      <header className="h-[72px] bg-[#002b49] border-b border-sky-950 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
          {/* Logo & Platform Tag */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/10 p-1 border border-white/20 backdrop-blur-md">
              <Image
                src="/learnbridge.png"
                alt="LearnBridge"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <div>
              <div className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>Learn<span className="text-sky-400">Bridge</span></span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-400/30">
                  Skills Academy
                </span>
              </div>
              <div className="hidden text-[8px] font-semibold uppercase tracking-[0.2em] text-sky-200/70 sm:block">
                Powered by Global Skills Standards
              </div>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden items-center gap-8 md:flex text-xs font-bold uppercase tracking-wider text-sky-100/90">
            <a href="#tracks" className="transition hover:text-sky-400">
              Learning Tracks
            </a>
            <a href="#how-it-works" className="transition hover:text-sky-400">
              How It Works
            </a>
            <a href="#features" className="transition hover:text-sky-400">
              Features
            </a>
            <a href="#safety" className="transition hover:text-sky-400">
              Safety & Trust
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-sky-100 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition border border-white/10"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="text-xs font-bold text-white bg-[#0070ad] hover:bg-[#005073] px-5 py-2.5 rounded-xl shadow-md transition border border-sky-400/30 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= NETACAD HERO SECTION ================= */}
      <section className="bg-gradient-to-br from-[#002b49] via-[#004870] to-[#0070ad] text-white relative overflow-hidden py-16 lg:py-24">
        {/* Background glowing tech graphics */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-bold uppercase tracking-wider border border-white/15">
              <span>🚀</span> Skills for All • AI & Certified Educator Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Accelerate Your Future With Certified Tutors.
            </h1>

            <p className="text-base sm:text-lg text-sky-100/90 max-w-2xl leading-relaxed">
              Connect with expert educators matched precisely to your subject goals, Ethiopian curriculum standards, and budget. Built for students, parents, and certified tutors.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/register"
                className="h-13 px-8 rounded-xl bg-[#0070ad] hover:bg-[#005073] active:bg-[#003d59] text-white font-extrabold text-sm shadow-xl transition-all duration-200 border border-sky-400/40 flex items-center justify-center gap-2"
              >
                <span>Find Your Tutor Match</span>
                <span className="text-lg">→</span>
              </Link>

              <a
                href="#tracks"
                className="h-13 px-8 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition flex items-center justify-center gap-2"
              >
                <span>Explore Learning Tracks</span>
              </a>
            </div>

            {/* Quick Stats Ticker */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">2,500+</div>
                <div className="text-xs font-semibold text-sky-200/80 uppercase tracking-wider">Verified Tutors</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-sky-300">98.4%</div>
                <div className="text-xs font-semibold text-sky-200/80 uppercase tracking-wider">Match Accuracy</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">50+</div>
                <div className="text-xs font-semibold text-sky-200/80 uppercase tracking-wider">Subjects & Tracks</div>
              </div>
            </div>
          </div>

          {/* Right NetAcad Hero Match Card Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-sky-200">
                    Live Smart Matcher
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider border border-sky-400/30">
                  AI Active
                </span>
              </div>

              {/* Tutor Feature Card */}
              <div className="rounded-2xl bg-white text-slate-900 p-6 shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-xl bg-[#002b49] text-white flex items-center justify-center font-black text-xl">
                      M
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Dr. Meron Tadesse</h3>
                      <p className="text-xs text-slate-500 font-medium">Senior Mathematics & Physics Tutor</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    ✓ Verified
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Match</p>
                    <p className="text-base font-black text-[#0070ad]">96%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Rating</p>
                    <p className="text-base font-black text-amber-500">4.95 ★</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Hourly</p>
                    <p className="text-base font-black text-slate-800">ETB 350</p>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="w-full h-10 rounded-xl bg-[#0070ad] hover:bg-[#005073] text-white text-xs font-bold flex items-center justify-center transition"
                >
                  Book Session with Match →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED LEARNING TRACKS ================= */}
      <section id="tracks" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#0070ad]">
              NetAcad Curriculum Tracks
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Popular Academic & Skill Domains
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Choose from structured learning tracks supported by verified Ethiopian tutors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📐",
                title: "STEM & Mathematics",
                level: "Grade 7 - University",
                tutors: "120+ Tutors",
                desc: "Algebra, Calculus, Physics, and Chemistry structured for national exam success.",
                tag: "High Demand",
              },
              {
                icon: "💻",
                title: "Computer & Software",
                level: "Beginner to Advanced",
                tutors: "85+ Tutors",
                desc: "Python programming, web development, robotics, and digital literacy.",
                tag: "Tech Track",
              },
              {
                icon: "🗣️",
                title: "Languages & Communication",
                level: "All Levels",
                tutors: "95+ Tutors",
                desc: "English fluency, Amharic grammar, Afaan Oromoo, and academic writing.",
                tag: "Core Skill",
              },
              {
                icon: "📝",
                title: "Grade 8 & 12 National Exams",
                level: "Exam Prep",
                tutors: "150+ Tutors",
                desc: "Targeted exam revision, practice tests, and timed mock assessments.",
                tag: "Exam Focused",
              },
            ].map((track, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-5 border-t-4 border-t-[#0070ad]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{track.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0070ad] text-[10px] font-extrabold uppercase tracking-wider border border-sky-200">
                      {track.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">{track.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{track.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{track.level}</span>
                  <span className="font-bold text-[#0070ad]">{track.tutors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (NETACAD STEPS) ================= */}
      <section id="how-it-works" className="py-20 bg-[#f0f4f8] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#0070ad]">
              Structured Learning Flow
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Three Steps to Learning Success
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Define Your Goal",
                text: "Select your role (Student or Parent), pick your target subjects, grade level, schedule, and hourly budget.",
              },
              {
                step: "02",
                title: "Review AI Matches",
                text: "Compare verified tutor credentials, national exam experience, parent reviews, and schedule availability.",
              },
              {
                step: "03",
                title: "Start & Track Progress",
                text: "Book sessions securely, track learning milestones, and receive regular parent progress updates.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200 p-8 shadow-md relative overflow-hidden space-y-4"
              >
                <div className="text-4xl font-black text-slate-200 absolute top-4 right-6 pointer-events-none">
                  {step.step}
                </div>

                <div className="h-12 w-12 rounded-2xl bg-[#002b49] text-white flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>

                <h3 className="text-xl font-extrabold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES & TRUST ================= */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#0070ad]">
              Platform Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Designed for Excellence & Safety
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-3 hover:bg-white hover:shadow-lg hover:border-sky-300 transition"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="text-base font-extrabold text-slate-900">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NETACAD FOOTER ================= */}
      <footer className="bg-[#002b49] text-white py-12 border-t border-sky-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 p-1 border border-white/20 flex items-center justify-center">
                <Image src="/learnbridge.png" alt="LearnBridge" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white">Learn<span className="text-sky-400">Bridge</span></span>
                <p className="text-xs text-sky-200/70">Connecting Learners, Parents, and Tutors</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-bold text-sky-200">
              <Link href="/login" className="hover:text-white transition">Sign In</Link>
              <Link href="/register" className="hover:text-white transition">Register</Link>
              <a href="#tracks" className="hover:text-white transition">Learning Tracks</a>
              <a href="#safety" className="hover:text-white transition">Safety</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-sky-200/60 gap-4">
            <p>&copy; {new Date().getFullYear()} LearnBridge Skills Academy. All rights reserved.</p>
            <p>Inspired by modern Skills for All design standards.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
