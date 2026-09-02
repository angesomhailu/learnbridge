import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Elegant Header Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/25">
              <Image
                src="/learnbridge.png"
                alt="LearnBridge Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              LearnBridge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#matching" className="hover:text-white transition-colors">Matching</a>
            <a href="#security" className="hover:text-white transition-colors">Safety Guards</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            >
              Register
            </Link>
          </div>
        </div>
      </header >

      {/* Hero Banner Section */}
      < main className="flex-grow flex flex-col justify-center" >
        <section className="relative overflow-hidden pt-24 pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.08),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.08),transparent_40%)]" />

          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400 mb-6 uppercase tracking-wider">
              ✨ Smart AI-Assisted tutor matches
            </div> */}

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight max-w-3xl">
              Tutoring Brokerage Built for{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                Safety & Results
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
              Connecting students with highly qualified local and online tutors using our fully transparent, weight-based AI matchmaker engine. Monitored and approved under parental controls.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-3.5 rounded-xl font-medium text-white shadow-lg shadow-indigo-500/25 transition-all text-center hover:shadow-indigo-500/35 active:scale-95"
              >
                Find Your Tutor Match
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-8 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white transition-all text-center"
              >
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white">Why families choose LearnBridge</h2>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Complete clarity and safety standard features that empower teachers, inspire students, and give parents peace of mind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Built-in Safety Checks</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Students under age 16 cannot send independent requests. Parents possess dashboard oversight to approve tutoring requests, monitor ongoing chats, and manage budgets.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Weighted AI Recommendations</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our system scores compatibility out of 100 based on subjects query match, schedule availability, pricing budgets, grade level coverage, and rating reputation.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                  💬
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Qualified Message Channels</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Unsolicited cold messaging is disabled. Conversations unlock automatically when a tutor accepts a tutoring match request and can be archived read-only upon completion.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main >

      {/* Footer */}
      < footer className="border-t border-slate-900 py-8 bg-slate-950 text-slate-500 text-center text-xs" >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} LearnBridge Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Support Portal</a>
          </div>
        </div>
      </footer >
    </div >
  );
}
