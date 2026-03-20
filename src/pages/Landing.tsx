import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Zap, Box, Wand2, ScanLine, Armchair, Camera } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '@/assets/hero-room.jpg'

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }),
}

const FEATURES = [
  { icon: Zap, title: '2D Floor Plan Editor', desc: 'Draw walls, rooms, doors and windows with precision snap-to-grid tools.' },
  { icon: Box, title: 'Real-Time 3D View', desc: 'See your floor plan come to life instantly in an interactive 3D scene.' },
  { icon: Wand2, title: 'AI Interior Design', desc: 'Upload a photo and get AI-redesigned interiors in any style.' },
  { icon: ScanLine, title: 'AI Plan Recognition', desc: 'Upload any blueprint and our AI converts it to editable floor plans.' },
  { icon: Armchair, title: '8,000+ Furniture Items', desc: 'A vast library of furniture and decor across every design style.' },
  { icon: Camera, title: '4K Photorealistic Renders', desc: 'Generate stunning renders to visualize spaces before building.' },
]

const PLANS = [
  {
    name: 'Starter', price: 0, period: 'forever',
    features: ['5 projects', '2D floor plan editor', 'Basic 3D view', '100 furniture items', '5 AI renders/month'],
  },
  {
    name: 'Pro', price: 19, period: '/month', popular: true,
    features: ['Unlimited projects', 'Full 3D + 4K renders', '8,000+ furniture items', 'Unlimited AI designs', '360° walkthroughs', 'HD exports', 'Priority support'],
  },
  {
    name: 'Enterprise', price: 79, period: '/month',
    features: ['Everything in Pro', 'Team collaboration', 'Custom branding', 'API access', 'Dedicated support', 'Custom furniture upload', 'White-label'],
  },
]

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'Interior Designer', text: 'HomeForge replaced three different tools in my workflow. The 2D-to-3D transition is seamless.', initials: 'SM' },
  { name: 'David Chen', role: 'Homeowner', text: 'I designed my entire kitchen renovation using HomeForge. The AI suggestions were spot-on.', initials: 'DC' },
  { name: 'Amara Okafor', role: 'Architect', text: 'The floor plan recognition saved me hours of manual redrawing. Incredible accuracy.', initials: 'AO' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Box className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground tracking-tight">HomeForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/editor" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.97]"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 bg-highlight/10 text-highlight px-3 py-1 rounded-full text-xs font-medium">
                  <Wand2 className="w-3 h-3" />
                  AI-Powered Design
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp} custom={1}
                className="text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.05] tracking-tight"
              >
                Design Your Dream Home in Minutes
              </motion.h1>
              <motion.p
                variants={fadeUp} custom={2}
                className="text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                Draw 2D floor plans, visualize in 3D, furnish with thousands of items, and generate AI-powered interior designs — all in one platform.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex items-center gap-4">
                <Link
                  to="/editor"
                  className="inline-flex items-center gap-2 bg-highlight text-highlight-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] shadow-lifted"
                >
                  Start Designing Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </motion.div>
              <motion.p variants={fadeUp} custom={4} className="text-xs text-muted-foreground">
                No credit card required · Free forever plan available
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-lifted border border-border/50">
                <img src={heroImage} alt="HomeForge 3D room design preview" className="w-full" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-medium border border-border p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-highlight/10 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-highlight" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">AI Redesign</p>
                  <p className="text-[11px] text-muted-foreground">Modern Minimalist</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Everything You Need to Design
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              From initial sketch to photorealistic render, HomeForge covers your entire design workflow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card rounded-2xl p-7 border border-border shadow-soft hover:shadow-medium transition-shadow group"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-highlight/10 transition-colors">
                  <f.icon className="w-5 h-5 text-accent group-hover:text-highlight transition-colors" />
                </div>
                <h3 className="text-base font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Start for free, upgrade when you need more power.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl p-7 border flex flex-col ${
                  plan.popular
                    ? 'border-highlight bg-card shadow-lifted relative'
                    : 'border-border bg-card shadow-soft'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-highlight text-highlight-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-display font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-display font-bold text-foreground tabular-nums">${plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-highlight mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/editor"
                  className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold text-center transition-opacity active:scale-[0.97] ${
                    plan.popular
                      ? 'bg-highlight text-highlight-foreground hover:opacity-90'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {plan.price === 0 ? 'Start Free' : 'Upgrade Now'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Loved by Designers & Homeowners
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 border border-border shadow-soft"
              >
                <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
            Ready to Design Your Space?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Join thousands of designers and homeowners who create stunning spaces with HomeForge.
          </p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 bg-highlight text-highlight-foreground px-8 py-4 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] mt-8 shadow-lifted"
          >
            Start Designing — It's Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Box className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-display font-bold text-foreground">HomeForge</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 HomeForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
