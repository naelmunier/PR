"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FileText, MessageSquare, BarChart3, Package, Zap } from "lucide-react";
import { ContainerScroll } from "./ContainerScroll";
import DisplayCards from "./DisplayCards";
import { PlatformMockup } from "./PlatformMockup";
import { Scene3D } from "./Scene3D";

// URL de la plateforme — prod vs dev
const APP_URL = import.meta.env.PUBLIC_APP_URL ?? "https://app.prlogistics.fr";

// ── Animations ────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

// ── Titre tournant ────────────────────────────────────────────────────────
function AnimatedTitle() {
  const [index, setIndex] = useState(0);
  const words = useMemo(() => ["Instantané.", "Transparent.", "Connecté."], []);
  useEffect(() => {
    const t = setTimeout(() => setIndex((i) => (i + 1) % words.length), 2200);
    return () => clearTimeout(t);
  }, [index, words]);

  return (
    <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-ink mb-0">
      <span className="block">Vos dossiers logistiques.</span>
      <span className="relative flex overflow-hidden h-[1.15em] mt-1">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="absolute bg-gradient-to-r from-primary to-primary-clair bg-clip-text text-transparent font-black"
            initial={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 55, damping: 14 }}
            animate={index === i ? { y: 0, opacity: 1 } : { y: index > i ? -60 : 60, opacity: 0 }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

// ── Boutons ────────────────────────────────────────────────────────────────
function BtnPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
    >
      {children}
    </a>
  );
}
function BtnOutline({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border-med text-ink-3 font-semibold text-sm hover:border-primary/30 hover:text-primary hover:bg-primary-50 hover:-translate-y-0.5 transition-all"
    >
      {children}
    </a>
  );
}

// ── Page principale ────────────────────────────────────────────────────────
export default function PRPlusPage() {
  return (
    <div className="min-h-screen bg-bg overflow-x-hidden font-sans">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(227,6,19,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(227,6,19,.022) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 60% 50%,black 0%,transparent 80%)",
            maskImage: "radial-gradient(ellipse 80% 80% at 60% 50%,black 0%,transparent 80%)",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-10 items-center">

          {/* Texte */}
          <div className="flex flex-col items-start">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary text-xs font-bold tracking-wide uppercase mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Plateforme opérationnelle · PR Logistics
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <img src="/brand/logo-pr-plus.png" alt="PR+" className="h-12 md:h-14 w-auto object-contain" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-6 w-full"
            >
              <AnimatedTitle />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-ink-3 leading-relaxed max-w-md mb-9"
            >
              Demandez vos devis, suivez vos dossiers en temps réel, échangez avec nos équipes
              — tout centralisé dans un seul espace dédié.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <BtnPrimary href={`${APP_URL}/connexion`}>
                Accéder à mon espace <ArrowRight className="w-4 h-4" />
              </BtnPrimary>
              <BtnOutline href={`${APP_URL}/connexion`}>
                Demander un accès
              </BtnOutline>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 text-xs text-ink-4"
            >
              {["Devis en minutes", "Suivi temps réel", "Messagerie intégrée"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />{t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Scène 3D */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative h-[420px] lg:h-[560px] w-full"
          >
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-[420px] h-[320px] rounded-full bg-primary/[0.06] blur-[80px]" />
            </div>
            <Scene3D className="w-full h-full" />
          </motion.div>

        </div>
      </section>

      {/* ── CONTAINER SCROLL — MOCKUP ── */}
      <ContainerScroll
        titleComponent={
          <div className="mb-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-50 border border-primary-200 px-3 py-1 rounded-full mb-4">
              Plateforme
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-ink leading-tight tracking-tight">
              Un espace client<br />
              <span className="text-ink-3 font-medium">pensé pour vous.</span>
            </h2>
          </div>
        }
      >
        <PlatformMockup />
      </ContainerScroll>

      {/* ── PILIERS ── */}
      <section className="border-y border-border bg-bg-subtle">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border"
        >
          {[
            { icon: "👁️", title: "Visibilité totale",           desc: "Chaque étape de vos dossiers en temps réel — de la réception à l'expédition." },
            { icon: "⚡", title: "Devis en minutes",             desc: "Votre grille tarifaire négociée est intégrée. Un prix précis, validé par la direction." },
            { icon: "💬", title: "Communication centralisée",    desc: "Messagerie, documents et historique au même endroit, par dossier." },
          ].map((p, i) => (
            <motion.div key={p.title} custom={i} variants={fadeUp}
              className="flex flex-col gap-4 px-10 py-12 hover:bg-primary-50 transition-colors cursor-default"
            >
              <span className="text-3xl">{p.icon}</span>
              <h3 className="font-display font-bold text-lg text-ink">{p.title}</h3>
              <p className="text-sm text-ink-3 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES + DISPLAY CARDS ── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-50 border border-primary-200 px-3 py-1 rounded-full mb-5">
              Fonctionnalités
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display font-black text-3xl md:text-4xl text-ink leading-tight tracking-tight mb-5">
              Tout ce qu'il vous faut,<br />rien de plus.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-ink-3 leading-relaxed mb-8">
              Une interface claire construite pour les opérations quotidiennes avec PR Logistics.
            </motion.p>

            <motion.div variants={stagger} className="flex flex-col gap-3">
              {[
                { icon: FileText,      title: "Devis intelligents",       desc: "Grille tarifaire par service. Prix calculé, validé en un clic." },
                { icon: Package,       title: "Suivi dossier temps réel",  desc: "Réception, dépotage, stock, expédition — chaque étape visible." },
                { icon: MessageSquare, title: "Messagerie intégrée",      desc: "Échanges directs avec votre interlocuteur PR Logistics." },
                { icon: BarChart3,     title: "Documents & analytiques",  desc: "BL, factures, packing list et historique accessibles à tout moment." },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.title} custom={i} variants={fadeUp}
                    whileHover={{ x: 4 }}
                    className="flex gap-3 items-start p-3.5 rounded-xl border border-transparent hover:border-primary-200 hover:bg-primary-50 transition-all cursor-default"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-100 border border-primary-200 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-ink">{f.title}</p>
                      <p className="text-xs text-ink-3 leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="flex justify-center lg:justify-end py-16">
            <DisplayCards
              cards={[
                {
                  className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-full before:h-full before:rounded-xl before:bg-white/50 before:content-[''] before:top-0 before:left-0 grayscale-[80%] hover:grayscale-0 before:transition-opacity before:duration-500 hover:before:opacity-0",
                  icon: <Package className="w-3.5 h-3.5 text-[#e30613]" />,
                  title: "Mes dossiers",
                  description: "PR-2606-MED-047 · En stock",
                  sub: "47 dossiers actifs",
                  titleClassName: "text-[#e30613]",
                },
                {
                  className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-full before:h-full before:rounded-xl before:bg-white/50 before:content-[''] before:top-0 before:left-0 grayscale-[50%] hover:grayscale-0 before:transition-opacity before:duration-500 hover:before:opacity-0",
                  icon: <FileText className="w-3.5 h-3.5 text-[#e30613]" />,
                  title: "Devis",
                  description: "Palettisation + Filmage · 2 400 €",
                  sub: "En attente de validation",
                  titleClassName: "text-[#e30613]",
                },
                {
                  className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                  icon: <MessageSquare className="w-3.5 h-3.5 text-[#e30613]" />,
                  title: "Messagerie",
                  description: "Équipe PR Logistics · 3 non lus",
                  sub: "Dernière activité il y a 5 min",
                  titleClassName: "text-[#e30613]",
                },
              ]}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── ÉTAPES ── */}
      <section className="bg-bg-subtle border-y border-border">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger} className="text-center mb-14"
          >
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-50 border border-primary-200 px-3 py-1 rounded-full mb-4">
              Parcours
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight">
              Du devis à l'expédition
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger} className="grid md:grid-cols-3 gap-5"
          >
            {[
              { n: "01", icon: Zap,           title: "Demandez un devis",    desc: "Décrivez votre besoin. Votre grille tarifaire génère une proposition précise en quelques minutes." },
              { n: "02", icon: CheckCircle2,   title: "Validez et confirmez", desc: "Acceptez le devis depuis votre espace. Il devient automatiquement un dossier actif à traiter." },
              { n: "03", icon: BarChart3,      title: "Suivez en temps réel", desc: "Chaque étape terrain saisie par nos équipes, visible instantanément. Documents disponibles dès clôture." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.n} custom={i} variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-surface border border-border rounded-2xl p-7 hover:border-primary-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-display font-black text-3xl text-primary-200 leading-none">{s.n}</span>
                  </div>
                  <h3 className="font-display font-bold text-ink mb-2">{s.title}</h3>
                  <p className="text-sm text-ink-3 leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-[#0a0a0f] to-[#1b0a0f] text-white px-8 py-16 lg:px-16 text-center"
        >
          <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
            <div className="w-[500px] h-[300px] rounded-full bg-primary/20 blur-[80px]" />
          </div>

          <div className="relative">
            <img src="/brand/logo-pr-plus.png" alt="PR+" className="h-10 w-auto object-contain mx-auto brightness-0 invert mb-6" />

            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="font-display font-black text-3xl md:text-5xl tracking-tight mb-4"
            >
              Votre espace vous attend.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="text-white/60 mb-10 max-w-md mx-auto"
            >
              Connectez-vous à PR+ ou contactez PR Logistics pour obtenir vos accès.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <a
                href={`${APP_URL}/connexion`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
              >
                Accéder à mon espace <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`${APP_URL}/connexion`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold hover:-translate-y-0.5 transition-all"
              >
                Demander un accès
              </a>
            </motion.div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-white/30">
              {["Le Havre · Rogerville · Sandouville", "Logistique d'entrepôt", "© 2026 PR Logistics"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
