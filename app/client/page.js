"use client";

import Link from "next/link";
import { CheckCircle2, Clapperboard, Image, Link2, MapPin, Sparkles, UserRound } from "lucide-react";

const projects = [
  ["Brand Launch Film", "Storyboard review", "In progress"],
  ["Founder Reel", "Voiceover selection", "Waiting"],
  ["Product Demo", "Delivery links", "Complete"],
];

export default function ClientPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>VisionHub</span>
        </Link>
        <p className="nav-label">WORKSPACE</p>
        <button className="nav-item active"><Clapperboard size={17} /><span>Projects</span></button>
        <button className="nav-item"><UserRound size={17} /><span>Characters</span></button>
        <button className="nav-item"><MapPin size={17} /><span>Locations</span></button>
        <button className="nav-item"><Link2 size={17} /><span>Deliveries</span></button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">CLIENT PORTAL</p>
            <h1 className="title">Vento creative workspace</h1>
          </div>
          <button className="primary">New request</button>
        </header>

        <section className="hero card">
          <div>
            <h2>Everything your AI video team needs.</h2>
            <p>
              Requirements, saved people, approved locations, and delivery links
              stay organized in one shared place.
            </p>
            <button className="primary">Upload brief</button>
          </div>
          <CheckCircle2 size={56} />
        </section>

        <section className="grid-stats">
          <div className="stat card"><div className="stat-top">Projects <Clapperboard size={18} /></div><strong>3</strong><small>Active jobs</small></div>
          <div className="stat card"><div className="stat-top">Characters <UserRound size={18} /></div><strong>6</strong><small>Reusable profiles</small></div>
          <div className="stat card"><div className="stat-top">Locations <MapPin size={18} /></div><strong>4</strong><small>Approved scenes</small></div>
          <div className="stat card"><div className="stat-top">Media <Image size={18} /></div><strong>18</strong><small>Reference assets</small></div>
        </section>

        <section className="content-grid">
          <div className="section-card card">
            <h2 className="section-title">Projects</h2>
            <p className="section-sub">Recovered visible workflow from the deployed app.</p>
            {projects.map(([name, meta, status]) => (
              <div className="project-row" key={name}>
                <span className="p-icon"><Clapperboard size={17} /></span>
                <div>
                  <p className="p-name">{name}</p>
                  <p className="p-meta">{meta}</p>
                </div>
                <span className="badge green">{status}</span>
              </div>
            ))}
          </div>
          <div className="section-card card">
            <h2 className="section-title">Recent activity</h2>
            <p className="section-sub">Production notes and delivery updates.</p>
            <div className="activity"><CheckCircle2 size={17} /><p>Storyboard reviewed<time>Today</time></p></div>
            <div className="activity"><Link2 size={17} /><p>Delivery link added<time>Yesterday</time></p></div>
            <div className="activity"><MapPin size={17} /><p>Location approved<time>This week</time></p></div>
          </div>
        </section>
      </main>
    </div>
  );
}
