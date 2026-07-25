"use client";

import Link from "next/link";
import { Building2, FolderKanban, LogOut, Plus, Sparkles, Users } from "lucide-react";

const companies = [
  {
    name: "Vento",
    status: "Active",
    description: "AI video requirements, characters, locations, and deliveries.",
    login: "vento01",
  },
  {
    name: "Uslu Digital Internal",
    status: "Draft",
    description: "Internal production workspace for reusable assets.",
    login: "internal",
  },
];

export default function CompaniesPage() {
  return (
    <main className="company-picker-page">
      <header className="company-picker-header">
        <Link href="/" className="login-brand">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>VisionHub</span>
        </Link>
        <Link className="filter" href="/">
          <LogOut size={16} /> Sign out
        </Link>
      </header>

      <section className="companies-home">
        <div className="company-home-create card">
          <p className="eyebrow">ADMIN WORKSPACE</p>
          <h2>Choose a company dashboard.</h2>
          <p>
            Manage company access, collect AI video requirements, and organize
            production material from one private portal.
          </p>
          <button className="primary">
            <Plus size={16} /> Add company
          </button>
        </div>

        <div className="grid-stats">
          <div className="stat card">
            <div className="stat-top">Companies <Building2 size={18} /></div>
            <strong>{companies.length}</strong>
            <small>Recovered sample state</small>
          </div>
          <div className="stat card">
            <div className="stat-top">Projects <FolderKanban size={18} /></div>
            <strong>8</strong>
            <small>Across client portals</small>
          </div>
          <div className="stat card">
            <div className="stat-top">Users <Users size={18} /></div>
            <strong>12</strong>
            <small>Admins and clients</small>
          </div>
          <div className="stat card">
            <div className="stat-top">Status <Sparkles size={18} /></div>
            <strong>Live</strong>
            <small>Vercel deployment recovered</small>
          </div>
        </div>

        <div className="company-grid-dashboard">
          {companies.map((company) => (
            <article className="company-dashboard-card card" key={company.name}>
              <Building2 size={26} />
              <strong>{company.name}</strong>
              <small>{company.description}</small>
              <em>{company.status} - login ID {company.login}</em>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
