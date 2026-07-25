"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function VisionHubLogin() {
  async function handleLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const loginId = String(form.get("loginId") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    if (!loginId || !password) {
      alert("Enter your VisionHub ID and password.");
      return;
    }

    if (!supabase) {
      alert("Supabase is not configured yet. Add your environment variables.");
      return;
    }

    const email = loginId.includes("@")
      ? loginId
      : `${loginId.replace(/[^a-z0-9._-]/g, "-")}@visionhub.local`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;
    const { data: profile } = userId
      ? await supabase.from("profiles").select("role").eq("id", userId).maybeSingle()
      : { data: null };

    window.location.assign(profile?.role === "admin" ? "/companies" : "/client");
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Link className="login-brand" aria-label="VisionHub login" href="/">
            <span className="brand-mark">
              <Sparkles size={16} />
            </span>
            <span>VisionHub</span>
          </Link>
          <p className="eyebrow" style={{ marginTop: 34 }}>
            USLU DIGITAL SECURE PORTAL
          </p>
          <h1 className="login-title">Log in to VisionHub.</h1>
          <p className="login-copy">
            Use the ID and password assigned to your workspace. Admins choose a
            company first, then open that company dashboard.
          </p>
          <div className="field" style={{ marginTop: 18 }}>
            <label htmlFor="loginId">VisionHub ID</label>
            <input id="loginId" name="loginId" type="text" placeholder="Example: vento01" autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
          </div>
          <button className="primary login-submit" type="submit">
            Log in <ArrowRight size={16} />
          </button>
        </motion.form>
      </section>
      <aside className="login-panel">
        <div className="login-photo" aria-hidden="true" />
        <div className="login-panel-copy">
          <LockKeyhole size={34} />
          <h2>Private access only.</h2>
          <p>
            Share clear AI video requirements, saved characters, locations, and
            finished delivery links in one simple portal.
          </p>
          <span className="login-success">
            <CheckCircle2 size={16} /> Recovered into editable source
          </span>
        </div>
      </aside>
    </main>
  );
}
