import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Smart Scheduling",
    desc: "Intuitive calendar with color-coded appointments, automated reminders, and easy rescheduling.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Insurance Billing",
    desc: "Submit claims, track approvals, and manage reimbursements all from one dashboard.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Treatment Plans",
    desc: "Create multi-session plans with progress tracking, goals, and session-by-session notes.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Compliance Tracking",
    desc: "Never miss a license renewal. Track HIPAA training, certifications, and permits in one place.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Client Management",
    desc: "Comprehensive client profiles with intake forms, condition history, and appointment records.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Revenue Analytics",
    desc: "Track monthly revenue, client retention, and practice growth with clear visual charts.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Dr. Emily Parker",
    role: "Licensed Acupuncturist",
    text: "WellnessFlow replaced three different tools I was using. Insurance billing alone saves me 5 hours a week.",
  },
  {
    name: "Mark Stevens, LMT",
    role: "Massage Therapist",
    text: "The treatment plan tracking is exactly what I needed. My clients love seeing their progress visualized.",
  },
  {
    name: "Dr. Lisa Chen, DC",
    role: "Chiropractor",
    text: "Compliance tracking gives me peace of mind. I never worry about expired licenses or certifications anymore.",
  },
];

const pricing = [
  {
    name: "Solo",
    price: "$29",
    desc: "Perfect for independent practitioners",
    features: [
      "Up to 50 clients",
      "Smart scheduling",
      "Treatment plans",
      "Basic reporting",
      "Email support",
    ],
  },
  {
    name: "Practice",
    price: "$59",
    desc: "For growing practices with multiple services",
    features: [
      "Unlimited clients",
      "Insurance billing",
      "Compliance tracking",
      "Revenue analytics",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    desc: "Multi-practitioner clinics",
    features: [
      "Everything in Practice",
      "Multiple practitioners",
      "Custom integrations",
      "HIPAA audit logs",
      "Dedicated account manager",
    ],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Wellness<span className="text-teal-600">Flow</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-teal-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-teal-600 transition-colors">Testimonials</a>
          </nav>
          <button
            onClick={() => navigate("/app")}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Try Demo
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            Built for wellness professionals
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Simplify Your
            <span className="text-teal-600"> Practice</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The all-in-one practice management platform for massage therapists, acupuncturists,
            nutrition coaches, and chiropractors. Scheduling, billing, compliance — handled.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/app")}
              className="bg-teal-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 cursor-pointer"
            >
              Try Demo Free
            </button>
            <a
              href="#features"
              className="text-gray-600 px-6 py-3.5 rounded-lg text-base font-medium hover:text-teal-600 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-teal-600 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "2,500+", label: "Practitioners" },
            { stat: "150K+", label: "Appointments/mo" },
            { stat: "98%", label: "Claim Approval" },
            { stat: "4.9/5", label: "Rating" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-white">{s.stat}</p>
              <p className="text-teal-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Everything Your Practice Needs</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Purpose-built tools for wellness practitioners. No more cobbling together generic software.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Loved by Practitioners</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-gray-600">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-8 shadow-sm border ${
                  plan.popular ? "border-teal-600 ring-2 ring-teal-600 relative" : "border-gray-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/app")}
                  className={`mt-8 w-full py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    plan.popular
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Start Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-teal-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Simplify Your Practice?</h2>
          <p className="mt-4 text-teal-100 text-lg">
            Join thousands of wellness practitioners who trust WellnessFlow to manage their practice.
          </p>
          <button
            onClick={() => navigate("/app")}
            className="mt-8 bg-white text-teal-700 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-teal-50 transition-colors shadow-lg cursor-pointer"
          >
            Try Demo Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="text-white font-bold">
              Wellness<span className="text-teal-400">Flow</span>
            </span>
          </div>
          <p className="text-sm">2026 WellnessFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
