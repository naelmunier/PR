import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Icônes SVG colorées ───────────────────────────────────

const CameraIcon = ({ c }: { c: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Corps caméra */}
    <rect x="1" y="5" width="15" height="14" rx="2.5" fill={c} fillOpacity="0.13" stroke={c} strokeWidth="1.55"/>
    {/* Objectif principal */}
    <circle cx="8.5" cy="12" r="3.2" fill={c} fillOpacity="0.18" stroke={c} strokeWidth="1.4"/>
    {/* Iris interne */}
    <circle cx="8.5" cy="12" r="1.5" fill={c} fillOpacity="0.5"/>
    {/* Pupille */}
    <circle cx="8.5" cy="12" r="0.6" fill={c}/>
    {/* Capteur lumière */}
    <circle cx="13.2" cy="6.8" r="1.1" fill={c}/>
    {/* Aile vidéo */}
    <path d="M23 7.5l-7 4.5 7 4.5V7.5z" fill={c} fillOpacity="0.18" stroke={c} strokeWidth="1.55" strokeLinejoin="round"/>
  </svg>
);

const MonitorIcon = ({ c }: { c: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Écran */}
    <rect x="1.5" y="2.5" width="21" height="15" rx="2.5" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="1.55"/>
    {/* Waveform cardiaque */}
    <polyline
      points="3.5,10.5 5.5,10.5 7.5,7 9.5,14 11.5,9.5 13.5,12.5 15.5,10.5 18.5,10.5"
      stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Pied */}
    <line x1="8.5" y1="21.5" x2="15.5" y2="21.5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="12" y1="17.5" x2="12" y2="21.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    {/* LED statut */}
    <circle cx="20" cy="4.5" r="1.2" fill={c}/>
  </svg>
);

const DatabaseIcon = ({ c }: { c: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Disque supérieur */}
    <ellipse cx="12" cy="5" rx="9" ry="3" fill={c} fillOpacity="0.18" stroke={c} strokeWidth="1.5"/>
    {/* Cylindre */}
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" fill={c} fillOpacity="0.07" stroke={c} strokeWidth="1.5"/>
    {/* Séparations */}
    <path d="M21 9.5c0 1.66-4 3-9 3s-9-1.34-9-3" stroke={c} strokeWidth="1.3" fill="none" strokeDasharray="2 1.5"/>
    <path d="M21 14c0 1.66-4 3-9 3s-9-1.34-9-3" stroke={c} strokeWidth="1.3" fill="none" strokeDasharray="2 1.5"/>
    {/* Reflet disque */}
    <ellipse cx="12" cy="5" rx="4" ry="1.2" fill={c} fillOpacity="0.35"/>
    {/* Verrou */}
    <circle cx="12" cy="5" r="0.9" fill={c}/>
  </svg>
);

const ShieldIcon = ({ c }: { c: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bouclier */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill={c} fillOpacity="0.12" stroke={c} strokeWidth="1.55" strokeLinejoin="round"/>
    {/* Étoile intérieure */}
    <polygon
      points="12,7.5 13.2,10.8 16.5,10.8 13.9,12.8 14.9,16.1 12,14.2 9.1,16.1 10.1,12.8 7.5,10.8 10.8,10.8"
      fill={c} fillOpacity="0.45" stroke={c} strokeWidth="0.6" strokeLinejoin="round"/>
    {/* Reflet */}
    <path d="M12 4.5l5.5 2v4.5" stroke={c} strokeWidth="1.1" strokeLinecap="round" fillOpacity="0.3" strokeOpacity="0.3"/>
  </svg>
);

const LockIcon = ({ c }: { c: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Corps cadenas */}
    <rect x="3" y="11" width="18" height="11" rx="3" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="1.55"/>
    {/* Anse */}
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    {/* Trou de serrure */}
    <circle cx="12" cy="16" r="2.2" fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1.2"/>
    <path d="M12 17.2v2.4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Rainures cadenas */}
    <line x1="6.5" y1="14.5" x2="6.5" y2="19" stroke={c} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.35"/>
    <line x1="17.5" y1="14.5" x2="17.5" y2="19" stroke={c} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.35"/>
  </svg>
);

const BadgeIcon = ({ c }: { c: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Carte */}
    <rect x="2" y="6" width="20" height="14" rx="2.5" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="1.55"/>
    {/* Puce NFC */}
    <rect x="4.5" y="10" width="6" height="5.5" rx="1.2" fill={c} fillOpacity="0.22" stroke={c} strokeWidth="1.2"/>
    {/* Lignes de données */}
    <line x1="14" y1="11.2" x2="19" y2="11.2" stroke={c} strokeWidth="1.35" strokeLinecap="round"/>
    <line x1="14" y1="13.5" x2="17.5" y2="13.5" stroke={c} strokeWidth="1.35" strokeLinecap="round"/>
    <line x1="14" y1="15.8" x2="18.5" y2="15.8" stroke={c} strokeWidth="1.35" strokeLinecap="round"/>
    {/* Clips */}
    <path d="M8 6V4.5a1.5 1.5 0 0 1 3 0V6" stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M13 6V4.5a1.5 1.5 0 0 1 3 0V6" stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    {/* Reflet carte */}
    <path d="M3.5 9.5h17" stroke={c} strokeWidth="0.8" strokeOpacity="0.25"/>
  </svg>
);

// ── Data sécurité ────────────────────────────────────────

type Item = {
  val: string;
  sub?: string;
  desc: string;
  color: string;
  colorBg: string;
  Icon: React.ComponentType<{ c: string }>;
};

const ITEMS: Item[] = [
  {
    val: '36 caméras HD',
    desc: "Couverture intégrale de l'ensemble du site",
    color: '#e30613',
    colorBg: 'rgba(227,6,19,0.1)',
    Icon: CameraIcon,
  },
  {
    val: 'Surveillance 24/7',
    sub: 'Intérieur & Extérieur',
    desc: 'Monitoring permanent avec reporting à domicile',
    color: '#3b82f6',
    colorBg: 'rgba(59,130,246,0.1)',
    Icon: MonitorIcon,
  },
  {
    val: 'Stockage vidéo 30 jours',
    desc: 'Conservation conforme aux exigences de la CNIL',
    color: '#22c55e',
    colorBg: 'rgba(34,197,94,0.1)',
    Icon: DatabaseIcon,
  },
  {
    val: 'Police portuaire',
    desc: "Sécurité renforcée par les forces de l'ordre du port",
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.1)',
    Icon: ShieldIcon,
  },
  {
    val: 'Site 100% clôturé',
    desc: "Enceinte sécurisée sur l'intégralité du périmètre",
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.1)',
    Icon: LockIcon,
  },
  {
    val: "Contrôle d'accès par badge",
    desc: "Accès réglementé à l'ensemble des zones du site",
    color: '#0ea5e9',
    colorBg: 'rgba(14,165,233,0.1)',
    Icon: BadgeIcon,
  },
];

// ── Constantes géométrie ─────────────────────────────────
const SIZE = 580;
const CENTER = SIZE / 2;
const ORBIT_R = 215;
const ICON_R = 36;      // demi-largeur bouton icône
const CENTER_R = 100;   // rayon carte centrale

const REVOLUTION_S = 28; // secondes pour un tour complet

// ── Composant ────────────────────────────────────────────
export default function SecuriteOrbit() {
  const [active, setActive] = useState<number | null>(null);

  const toggle = (i: number) => setActive(prev => (prev === i ? null : i));

  const activeItem = active !== null ? ITEMS[active] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Keyframes injectées */}
      <style>{`
        @keyframes __orbit-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes __orbit-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes __pulse-out {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>

      <div style={{ position: 'relative', width: SIZE, height: SIZE, maxWidth: '100%' }}>

        {/* ── Anneau SVG ── */}
        <svg
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          width={SIZE} height={SIZE}
        >
          <defs>
            <radialGradient id="__orbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(227,6,19,0.07)"/>
              <stop offset="65%"  stopColor="rgba(227,6,19,0.03)"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
            {/* Gradient pour l'anneau principal */}
            <linearGradient id="__ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="rgba(227,6,19,0.18)"/>
              <stop offset="50%"  stopColor="rgba(227,6,19,0.06)"/>
              <stop offset="100%" stopColor="rgba(227,6,19,0.18)"/>
            </linearGradient>
          </defs>

          {/* Halo de fond */}
          <circle cx={CENTER} cy={CENTER} r={ORBIT_R + 30} fill="url(#__orbGlow)" />

          {/* Anneau principal */}
          <circle
            cx={CENTER} cy={CENTER} r={ORBIT_R}
            stroke="url(#__ringGrad)" strokeWidth="1.5"
            fill="none"
          />

          {/* Anneau intérieur décoratif */}
          <circle
            cx={CENTER} cy={CENTER} r={CENTER_R + 16}
            stroke="rgba(0,0,0,0.05)" strokeWidth="1"
            fill="none"
          />

          {/* Points aux positions des icônes (quand le carousel tourne) */}
          {ITEMS.map((_, i) => {
            const angleDeg = (i * 360) / ITEMS.length - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const px = CENTER + ORBIT_R * Math.cos(angleRad);
            const py = CENTER + ORBIT_R * Math.sin(angleRad);
            return <circle key={i} cx={px} cy={py} r="2.5" fill="rgba(227,6,19,0.15)" />;
          })}
        </svg>

        {/* ── Wrapper orbit — tourne lentement ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: `__orbit-cw ${REVOLUTION_S}s linear infinite`,
            animationPlayState: active !== null ? 'paused' : 'running',
          }}
        >
          {ITEMS.map((item, i) => {
            const angleDeg = (i * 360) / ITEMS.length - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = CENTER + ORBIT_R * Math.cos(angleRad);
            const y = CENTER + ORBIT_R * Math.sin(angleRad);
            const isActive = i === active;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x - ICON_R,
                  top: y - ICON_R,
                  width: ICON_R * 2,
                  height: ICON_R * 2,
                  /* Counter-rotation pour que les icônes restent droites */
                  animation: `__orbit-ccw ${REVOLUTION_S}s linear infinite`,
                  animationPlayState: active !== null ? 'paused' : 'running',
                }}
              >
                {/* Anneau pulsant sur icône active */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: -8,
                      borderRadius: '50%',
                      border: `2px solid ${item.color}`,
                      animation: '__pulse-out 1.6s ease-out infinite',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <motion.button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: isActive
                      ? `2.5px solid ${item.color}`
                      : '2px solid rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive ? item.colorBg : 'white',
                    boxShadow: isActive
                      ? `0 0 0 5px ${item.color}18, 0 8px 28px ${item.color}35`
                      : '0 3px 18px rgba(0,0,0,0.1)',
                    transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
                  }}
                  animate={{ scale: isActive ? 1.22 : 1 }}
                  whileHover={{ scale: isActive ? 1.22 : 1.12 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  aria-label={item.val}
                  title={item.val}
                >
                  <item.Icon c={item.color} />
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* ── Carte centrale ── */}
        <div
          style={{
            position: 'absolute',
            left: CENTER - CENTER_R,
            top: CENTER - CENTER_R,
            width: CENTER_R * 2,
            height: CENTER_R * 2,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        >
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.32, ease: [0.34, 1.2, 0.64, 1] }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.97)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: `0 10px 50px rgba(0,0,0,0.1), 0 0 0 2px ${activeItem.color}22`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '1rem 1.3rem',
                  overflow: 'hidden',
                  pointerEvents: 'all',
                  cursor: 'default',
                }}
              >
                {/* Icône active agrandie */}
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: activeItem.colorBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.3rem',
                  flexShrink: 0,
                }}>
                  <activeItem.Icon c={activeItem.color} />
                </div>

                {/* Valeur */}
                <span style={{
                  fontSize: '0.83rem',
                  fontWeight: 700,
                  color: '#1d1d1f',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}>
                  {activeItem.val}
                </span>

                {/* Sous-titre optionnel */}
                {activeItem.sub && (
                  <span style={{
                    fontSize: '0.63rem',
                    fontWeight: 600,
                    color: activeItem.color,
                    marginTop: '0.08rem',
                    lineHeight: 1.2,
                  }}>
                    {activeItem.sub}
                  </span>
                )}

                {/* Description */}
                <span style={{
                  fontSize: '0.6rem',
                  color: '#8e8e93',
                  lineHeight: 1.4,
                  marginTop: '0.22rem',
                }}>
                  {activeItem.desc}
                </span>
              </motion.div>
            ) : (
              /* Centre vide — indicateur subtil */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span style={{
                  fontSize: '0.58rem',
                  color: 'rgba(0,0,0,0.18)',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                  maxWidth: 110,
                  lineHeight: 1.5,
                  textTransform: 'uppercase',
                }}>
                  Cliquez<br/>une icône
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
