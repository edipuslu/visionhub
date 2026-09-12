"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, FolderKanban, LogOut, Plus, Sparkles, Users } from "lucide-react";
import { clearPrivateSession, readPrivateProfile, readSessionToken } from "../../lib/session";

export default function CompaniesPage() {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [mode, setMode] = useState("loading");
  const [message, setMessage] = useState("");

  const totalUsers = useMemo(
    () => companies.reduce((sum, company) => sum + (company.portal_users?.length || 0), 0),
    [companies]
  );

  async function loadCompanies(sessionToken = token) {
    if (!sessionToken) return;
    const response = await fetch("/api/admin/companies", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(result.error || "Could not load companies.");
      return;
    }

    setCompanies(result.companies || []);
    setMode(result.mode || "database");
  }

  useEffect(() => {
    const savedProfile = readPrivateProfile();
    const savedToken = readSessionToken();

    if (!savedProfile || savedProfile.role !== "admin" || !savedToken) {
      window.location.assign("/login");
      return;
    }

    setProfile(savedProfile);
    setToken(savedToken);
    loadCompanies(savedToken);
  }, []);

  async function createCompany(event) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description"),
        status: form.get("status"),
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(result.error || "Could not create company.");
      return;
    }

    event.currentTarget.reset();
    setMessage("Company created.");
    loadCompanies();
  }

  async function createUser(event) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        loginId: form.get("loginId"),
        password: form.get("password"),
        fullName: form.get("fullName"),
        email: form.get("email"),
        role: form.get("role"),
        companyId: form.get("companyId"),
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(result.error || "Could not create user.");
      return;
    }

    event.currentTarget.reset();
    setMessage(`Login ${result.user.login_id} created.`);
    loadCompanies();
  }

  function signOut() {
    clearPrivateSession();
    window.location.assign("/login");
  }

  return (
    <main className="company-picker-page">
      <header className="company-picker-header">
        <Link href="/" className="login-brand">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>VisionHub</span>
        </Link>
        <button className="filter" type="button" onClick={signOut}>
          <LogOut size={16} /> Sign out
        </button>
      </header>

      <section className="companies-home">
        <div className="company-home-create card">
          <p className="eyebrow">ADMIN WORKSPACE</p>
          <h2>Manage company access.</h2>
          <p>
            Create companies and client logins from this dashboard. Passwords are
            hashed on the server before they are saved.
          </p>
          {message ? <p className="section-sub">{message}</p> : null}
          {mode === "env" ? (
            <p className="section-sub">
              Database mode is not configured yet. Existing logins are loaded from
              the private environment list, but new companies require Supabase setup.
            </p>
          ) : null}
        </div>

        <div className="grid-stats">
          <div className="stat card">
            <div className="stat-top">Companies <Building2 size={18} /></div>
            <strong>{companies.length}</strong>
            <small>{mode === "loading" ? "Loading" : "Managed records"}</small>
          </div>
          <div className="stat card">
            <div className="stat-top">Projects <FolderKanban size={18} /></div>
            <strong>8</strong>
            <small>Across client portals</small>
          </div>
          <div className="stat card">
            <div className="stat-top">Users <Users size={18} /></div>
            <strong>{totalUsers}</strong>
            <small>Portal logins</small>
          </div>
          <div className="stat card">
            <div className="stat-top">Status <Sparkles size={18} /></div>
            <strong>{mode === "database" ? "Database" : "Setup"}</strong>
            <small>{profile?.loginId || "Admin"}</small>
          </div>
        </div>

        <section className="content-grid">
          <form className="section-card card" onSubmit={createCompany}>
            <h2 className="section-title">Add company</h2>
            <div className="field">
              <label htmlFor="name">Company name</label>
              <input id="name" name="name" type="text" placeholder="Example: Vento" />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <input id="description" name="description" type="text" placeholder="Client workspace description" />
            </div>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue="Active">
                <option>Active</option>
                <option>Draft</option>
              </select>
            </div>
            <button className="primary" type="submit"><Plus size={16} /> Add company</button>
          </form>

          <form className="section-card card" onSubmit={createUser}>
            <h2 className="section-title">Add login</h2>
            <div className="field">
              <label htmlFor="companyId">Company</label>
              <select id="companyId" name="companyId">
                <option value="">No company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="loginId">Login ID</label>
              <input id="loginId" name="loginId" type="text" placeholder="Example: vento01" />
            </div>
            <div className="field">
              <label htmlFor="password">Temporary password</label>
              <input id="password" name="password" type="password" placeholder="At least 8 characters" />
            </div>
            <div className="field">
              <label htmlFor="fullName">Name</label>
              <input id="fullName" name="fullName" type="text" placeholder="Employee name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="Optional" />
            </div>
            <div className="field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue="client">
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="primary" type="submit"><Plus size={16} /> Add login</button>
          </form>
        </section>

        <div className="company-grid-dashboard">
          {companies.map((company) => (
            <article className="company-dashboard-card card" key={company.id}>
              <Building2 size={26} />
              <strong>{company.name}</strong>
              <small>{company.description || "No description"}</small>
              <em>{company.status} - {(company.portal_users || []).length} login(s)</em>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
