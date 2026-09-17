import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#f5eee5] text-[#2d211b]">

      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold">
          TiffinFlow
        </h1>

        <Link
          to="/login"
          className="bg-[#754936] text-white px-5 py-2 rounded-full"
        >
          Owner Login
        </Link>
      </nav>

      <section className="text-center py-24 px-6">
        <p className="uppercase tracking-widest text-sm mb-4">
          Homemade • Simple • Reliable
        </p>

        <h2 className="text-5xl font-bold max-w-3xl mx-auto">
          Simple tiffin management,
          <br />
          smarter billing.
        </h2>

        <p className="max-w-xl mx-auto mt-6 text-lg">
          Manage subscriptions, pauses and daily deliveries
          while billing customers only for meals actually served.
        </p>

        <Link
          to="/login"
          className="inline-block mt-8 bg-[#2d211b] text-white px-7 py-3 rounded-full"
        >
          Get Started
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-6 px-8 pb-20 max-w-6xl mx-auto">

        <Feature
          title="Daily Ledger"
          text="Track every scheduled, delivered, paused and holiday meal."
        />

        <Feature
          title="Fair Billing"
          text="Generate transparent bills based on meals actually served."
        />

        <Feature
          title="Kitchen Count"
          text="Know exactly how many tiffins need to be prepared."
        />

      </section>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="bg-white/70 p-8 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

export default Landing;