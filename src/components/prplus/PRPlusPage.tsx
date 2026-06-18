"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FileText, MessageSquare, Package } from "lucide-react";
import { ContainerScroll } from "./ContainerScroll";
import DisplayCards from "./DisplayCards";
import { GradientCard } from "./GradientCard";
import { PlatformMockup } from "./PlatformMockup";

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
    <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-ink mb-0">
      <span className="block">Vos dossiers logistiques.</span>
      <span className="relative flex justify-center overflow-hidden h-[1.15em] mt-1">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="absolute inset-x-0 text-center bg-gradient-to-r from-primary to-primary-clair bg-clip-text text-transparent font-black"
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

// ── Page principale ────────────────────────────────────────────────────────
export default function PRPlusPage() {
  return (
    <div className="prp-root-wrapper min-h-screen bg-bg overflow-x-hidden font-sans">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(227,6,19,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(227,6,19,.022) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 80%)",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 80%)",
          }}
        />

        <div className="relative w-full max-w-5xl mx-auto px-6 lg:px-10 pt-16 pb-10 flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary text-xs font-bold tracking-wide uppercase mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Plateforme opérationnelle · PR Logistics
          </motion.div>

          {/* Logo dans encadré blanc */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex bg-white rounded-xl px-5 py-3 shadow-sm border border-[#f0e8e8]">
              <img src="/brand/logo-pr-plus.png" alt="PR+" className="h-11 w-auto object-contain" />
            </div>
          </motion.div>

          {/* Titre animé */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-6 w-full"
          >
            <AnimatedTitle />
          </motion.div>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-ink-3 leading-relaxed max-w-2xl mb-9"
          >
            Demandez vos devis, suivez vos dossiers en temps réel et échangez avec nos équipes.
            Tout centralisé dans un seul espace.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          >
            <a
              href={`${APP_URL}/connexion`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
            >
              Accéder à mon espace <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${APP_URL}/demande-acces`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[#e8e0e0] text-ink-3 font-semibold text-sm hover:border-primary/30 hover:text-primary hover:bg-primary-50 hover:-translate-y-0.5 transition-all"
            >
              Demander un accès
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 text-xs text-ink-4 justify-center"
          >
            {["Devis en minutes", "Suivi temps réel", "Messagerie intégrée"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />{t}
              </span>
            ))}
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

      {/* ── FONCTIONNALITÉS ── */}
      <section className="py-20">
        {/* En-tête */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="text-center mb-16 px-5"
        >
          <motion.span variants={fadeUp} className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-50 border border-primary-200 px-3 py-1 rounded-full mb-4">
            Fonctionnalités
          </motion.span>
          <motion.h2 variants={fadeUp} className="font-display font-black text-3xl md:text-4xl text-ink tracking-tight">
            Tout ce qu&apos;il vous faut,<br />rien de plus.
          </motion.h2>
        </motion.div>

        {/* 2 colonnes : DisplayCards gauche — GradientCards droite */}
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">

          {/* Gauche — Display Cards à taille naturelle */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex justify-center py-20 overflow-visible"
          >
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

          {/* Droite — Gradient Cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <GradientCard
              gradient="orange"
              badgeText="Suivi temps réel"
              badgeColor="#f97316"
              title="Chaque étape, en direct"
              description="De la réception à l'expédition, suivez l'avancement de vos dossiers en temps réel. Rien ne vous échappe."
              ctaText="Voir mes dossiers"
              ctaHref={`${APP_URL}/connexion`}
            />
            <GradientCard
              gradient="green"
              badgeText="Devis intelligents"
              badgeColor="#10b981"
              title="Un prix précis en minutes"
              description="Votre grille tarifaire négociée est intégrée. La plateforme calcule, la direction valide."
              ctaText="Demander un devis"
              ctaHref={`${APP_URL}/connexion`}
            />
            <GradientCard
              gradient="purple"
              badgeText="Documents & Factures"
              badgeColor="#8b5cf6"
              title="Tous vos documents au même endroit"
              description="BL, packing lists, factures et historique disponibles directement dans votre espace, à tout moment."
              ctaText="Accéder à mon espace"
              ctaHref={`${APP_URL}/connexion`}
            />
          </motion.div>
        </div>

        {/* Parcours */}
        <div className="max-w-6xl mx-auto px-5 mt-20">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger} className="text-center mb-10"
          >
            <motion.h3 variants={fadeUp} className="font-display font-black text-2xl md:text-3xl text-ink tracking-tight">
              Du devis à l&apos;expédition
            </motion.h3>
            <motion.p variants={fadeUp} className="text-sm text-ink-4 mt-2">
              Trois étapes, zéro friction.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger} className="grid md:grid-cols-3 gap-4"
          >
            {[
              { n: "01", title: "Demandez un devis",    desc: "Décrivez votre besoin. Votre grille tarifaire génère une proposition précise en quelques minutes." },
              { n: "02", title: "Validez et confirmez", desc: "Acceptez le devis depuis votre espace. Il devient automatiquement un dossier actif." },
              { n: "03", title: "Suivez en temps réel", desc: "Chaque étape terrain saisie par nos équipes, visible instantanément." },
            ].map((s, i) => (
              <motion.div
                key={s.n} custom={i} variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-white border border-[#f0e8e8] rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <span className="font-display font-black text-3xl text-primary/20 leading-none block mb-4">{s.n}</span>
                <h4 className="font-display font-bold text-sm text-ink mb-1.5">{s.title}</h4>
                <p className="text-xs text-ink-3 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
