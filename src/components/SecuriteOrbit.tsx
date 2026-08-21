import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Icônes SVG colorées ───────────────────────────────────

const CameraIcon = ({ c }: { c: string }) => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="5" width="15" height="14" rx="2.5" fill={c} fillOpacity="0.13" stroke={c} strokeWidth="1.55"/>
    <circle cx="8.5" cy="12" r="3.2" fill={c} fillOpacity="0.18" stroke={c} strokeWidth="1.4"/>
    <circle cx="8.5" cy="12" r="1.5" fill={c} fillOpacity="0.5"/>
    <circle cx="8.5" cy="12" r="0.6" fill={c}/>
    <circle cx="13.2" cy="6.8" r="1.1" fill={c}/>
    <path d="M23 7.5l-7 4.5 7 4.5V7.5z" fill={c} fillOpacity="0.18" stroke={c} strokeWidth="1.55" strokeLinejoin="round"/>
  </svg>
);

const MonitorIcon = ({ c }: { c: string }) => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="2.5" width="21" height="15" rx="2.5" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="1.55"/>
    <polyline points="3.5,10.5 5.5,10.5 7.5,7 9.5,14 11.5,9.5 13.5,12.5 15.5,10.5 18.5,10.5"
      stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="8.5" y1="21.5" x2="15.5" y2="21.5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="12" y1="17.5" x2="12" y2="21.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="4.5" r="1.2" fill={c}/>
  </svg>
);

const DatabaseIcon = ({ c }: { c: string }) => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="5" rx="9" ry="3" fill={c} fillOpacity="0.18" stroke={c} strokeWidth="1.5"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" fill={c} fillOpacity="0.07" stroke={c} strokeWidth="1.5"/>
    <path d="M21 9.5c0 1.66-4 3-9 3s-9-1.34-9-3" stroke={c} strokeWidth="1.3" fill="none" strokeDasharray="2 1.5"/>
    <path d="M21 14c0 1.66-4 3-9 3s-9-1.34-9-3" stroke={c} strokeWidth="1.3" fill="none" strokeDasharray="2 1.5"/>
    <ellipse cx="12" cy="5" rx="4" ry="1.2" fill={c} fillOpacity="0.35"/>
    <circle cx="12" cy="5" r="0.9" fill={c}/>
  </svg>
);

const ShieldIcon = ({ c }: { c: string }) => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill={c} fillOpacity="0.12" stroke={c} strokeWidth="1.55" strokeLinejoin="round"/>
    <polygon points="12,7.5 13.2,10.8 16.5,10.8 13.9,12.8 14.9,16.1 12,14.2 9.1,16.1 10.1,12.8 7.5,10.8 10.8,10.8"
      fill={c} fillOpacity="0.45" stroke={c} strokeWidth="0.6" strokeLinejoin="round"/>
    <path d="M12 4.5l5.5 2v4.5" stroke={c} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.3"/>
  </svg>
);

const LockIcon = ({ c }: { c: string }) => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="11" rx="3" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="1.55"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <circle cx="12" cy="16" r="2.2" fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1.2"/>
    <path d="M12 17.2v2.4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="6.5" y1="14.5" x2="6.5" y2="19" stroke={c} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.35"/>
    <line x1="17.5" y1="14.5" x2="17.5" y2="19" stroke={c} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.35"/>
  </svg>
);

const BadgeIcon = ({ c }: { c: string }) => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="14" rx="2.5" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="1.55"/>
    <rect x="4.5" y="10" width="6" height="5.5" rx="1.2" fill={c} fillOpacity="0.22" stroke={c} strokeWidth="1.2"/>
    <line x1="14" y1="11.2" x2="19" y2="11.2" stroke={c} strokeWidth="1.35" strokeLinecap="round"/>
    <line x1="14" y1="13.5" x2="17.5" y2="13.5" stroke={c} strokeWidth="1.35" strokeLinecap="round"/>
    <line x1="14" y1="15.8" x2="18.5" y2="15.8" stroke={c} strokeWidth="1.35" strokeLinecap="round"/>
    <path d="M8 6V4.5a1.5 1.5 0 0 1 3 0V6" stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M13 6V4.5a1.5 1.5 0 0 1 3 0V6" stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M3.5 9.5h17" stroke={c} strokeWidth="0.8" strokeOpacity="0.25"/>
  </svg>
);

// ── Data ─────────────────────────────────────────────────

type Item = {
  label: string;
  val: string;
  sub?: string;
  desc: string;
  color: string;
  colorBg: string;
  Icon: React.ComponentType<{ c: string }>;
};

const ITEMS: Item[] = [
  { label: 'Caméras',    val: '36 caméras HD',              desc: "Couverture intégrale de l'ensemble du site",                   color: '#e30613', colorBg: 'rgba(227,6,19,0.1)',   Icon: CameraIcon },
  { label: 'Monitoring', val: 'Surveillance 24/7',           sub: 'Intérieur & Extérieur', desc: 'Monitoring permanent avec reporting à domicile', color: '#3b82f6', colorBg: 'rgba(59,130,246,0.1)', Icon: MonitorIcon },
  { label: 'Stockage',   val: 'Vidéo 30 jours',             desc: 'Conservation conforme aux exigences de la CNIL',              color: '#22c55e', colorBg: 'rgba(34,197,94,0.1)',  Icon: DatabaseIcon },
  { label: 'Police',     val: 'Police portuaire',            desc: "Sécurité renforcée par les forces de l'ordre du port",        color: '#8b5cf6', colorBg: 'rgba(139,92,246,0.1)', Icon: ShieldIcon },
  { label: 'Clôture',    val: 'Site 100% clôturé',          desc: "Enceinte sécurisée sur l'intégralité du périmètre",           color: '#f59e0b', colorBg: 'rgba(245,158,11,0.1)', Icon: LockIcon },
  { label: 'Badge',      val: "Contrôle par badge",         desc: "Accès réglementé à l'ensemble des zones du site",             color: '#0ea5e9', colorBg: 'rgba(14,165,233,0.1)', Icon: BadgeIcon },
];

const SIZE = 720;
const CENTER = SIZE / 2;
const ORBIT_R = 295;
const ICON_R = 58;
const CENTER_R = 128;
const REVOLUTION_S = 28;

// ── Composant ────────────────────────────────────────────
export default function SecuriteOrbit() {
  const [active, setActive] = useState<number | null>(null);

  const toggle = (i: number) => setActive(prev => (prev === i ? null : i));
  const activeItem = active !== null ? ITEMS[active] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

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
          0%   { transform: scale(1);   opacity: 0.65; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <div style={{ position: 'relative', width: SIZE, height: SIZE, maxWidth: '100%' }}>

        {/* Lueur centrale uniquement — plus de ligne de périmètre */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={SIZE} height={SIZE}>
          <defs>
            <radialGradient id="__orbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(227,6,19,0.07)"/>
              <stop offset="65%"  stopColor="rgba(227,6,19,0.025)"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <circle cx={CENTER} cy={CENTER} r={ORBIT_R + 40} fill="url(#__orbGlow)" />
        </svg>

        {/* Wrapper orbit — tourne en continu */}
        <div style={{
          position: 'absolute',
          inset: 0,
          animation: `__orbit-cw ${REVOLUTION_S}s linear infinite`,
          animationPlayState: 'running',
        }}>
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
                  animation: `__orbit-ccw ${REVOLUTION_S}s linear infinite`,
                  animationPlayState: 'running',
                }}
              >
                {/* Anneaux pulsants */}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    inset: -10,
                    borderRadius: '50%',
                    border: `2px solid ${item.color}`,
                    animation: '__pulse-out 1.5s ease-out infinite',
                    pointerEvents: 'none',
                  }} />
                )}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    border: `2px solid ${item.color}`,
                    animation: '__pulse-out 1.5s ease-out 0.5s infinite',
                    pointerEvents: 'none',
                  }} />
                )}

                <motion.button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: isActive ? `2.5px solid ${item.color}` : '2px solid rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive ? item.colorBg : 'white',
                    boxShadow: isActive
                      ? `0 0 0 6px ${item.color}18, 0 8px 30px ${item.color}40`
                      : '0 3px 18px rgba(0,0,0,0.1)',
                    transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
                  }}
                  animate={{ scale: isActive ? 1.38 : 1 }}
                  whileHover={{ scale: isActive ? 1.38 : 1.12 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  aria-label={item.val}
                  title={item.val}
                >
                  <item.Icon c={item.color} />
                </motion.button>

                {/* Label mot-clé sous le bouton */}
                <div style={{
                  position: 'absolute',
                  top: ICON_R * 2 + 7,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: isActive ? item.color : 'rgba(0,0,0,0.45)',
                    letterSpacing: '0.03em',
                    transition: 'color 0.25s',
                  }}>
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carte centrale */}
        <div style={{
          position: 'absolute',
          left: CENTER - CENTER_R,
          top: CENTER - CENTER_R,
          width: CENTER_R * 2,
          height: CENTER_R * 2,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 4,
        }}>
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.72 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.72 }}
                transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.97)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: `0 12px 56px rgba(0,0,0,0.11), 0 0 0 2.5px ${activeItem.color}28`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '1.2rem 1.8rem',
                  overflow: 'hidden',
                  pointerEvents: 'all',
                  cursor: 'default',
                }}
              >
                {/* Icône active agrandie */}
                <motion.div
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: '50%',
                    background: activeItem.colorBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.4rem',
                    flexShrink: 0,
                    border: `1.5px solid ${activeItem.color}30`,
                  }}
                >
                  <activeItem.Icon c={activeItem.color} />
                </motion.div>

                {/* Valeur principale */}
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#1d1d1f',
                  lineHeight: 1.18,
                  letterSpacing: '-0.02em',
                }}>
                  {activeItem.val}
                </span>

                {activeItem.sub && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: activeItem.color,
                    marginTop: '0.12rem',
                    lineHeight: 1.2,
                  }}>
                    {activeItem.sub}
                  </span>
                )}

                <span style={{
                  fontSize: '0.64rem',
                  color: '#8e8e93',
                  lineHeight: 1.45,
                  marginTop: '0.3rem',
                }}>
                  {activeItem.desc}
                </span>
              </motion.div>
            ) : (
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
                  fontSize: '0.6rem',
                  color: 'rgba(0,0,0,0.18)',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textAlign: 'center',
                  maxWidth: 110,
                  lineHeight: 1.6,
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
