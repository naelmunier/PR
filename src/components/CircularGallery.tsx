import React, { useRef, useEffect } from 'react';
import { useI18n } from './useI18n';

export type GalleryItem = {
  image: string;
  text: string;
  desc?: string;
  /* Clés i18n — permettent la traduction côté React */
  textKey?: string;
  descKey?: string;
};

interface Props {
  items: GalleryItem[];
  scrollEase?: number;
  direction?: 'left' | 'right';
}

const CARD_W = 240;
const CARD_H = 310;
const GAP = 16;
const STRIDE = CARD_W + GAP;

export default function CircularGallery({ items, scrollEase = 0.06, direction = 'right' }: Props) {
  const t = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef       = useRef(0);
  const targetRef    = useRef(0);
  const dragging     = useRef(false);
  const startX       = useRef(0);
  const startTarget  = useRef(0);
  const frameRef     = useRef<number>();
  const itemEls      = useRef<(HTMLDivElement | null)[]>([]);

  const N      = items.length;
  const totalW = N * STRIDE;

  /* ── Événements souris / tactile ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current += (e.deltaX !== 0 ? e.deltaX : e.deltaY) * 1.8;
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging.current  = true;
      startX.current    = e.clientX;
      startTarget.current = targetRef.current;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      targetRef.current = startTarget.current - (e.clientX - startX.current) * 2.4;
    };

    const onPointerUp = () => {
      dragging.current = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  /* ── Boucle d'animation ── */
  useEffect(() => {
    const AUTO_SPEED = 0.6; // px/frame de défilement automatique

    const tick = () => {
      /* Défilement automatique continu */
      targetRef.current += AUTO_SPEED * (direction === 'left' ? -1 : 1);

      posRef.current += (targetRef.current - posRef.current) * scrollEase;

      const W    = containerRef.current?.offsetWidth ?? 960;
      const half = W / 2;

      itemEls.current.forEach((el, i) => {
        if (!el) return;

        /* Position brute de l'élément dans la bande infinie */
        let rawX = i * STRIDE - posRef.current;

        /* Wrapping dans [−totalW/2, totalW/2) */
        rawX = ((rawX + totalW / 2) % totalW + totalW) % totalW - totalW / 2;

        /* Position écran : centré */
        const screenX = rawX + half - CARD_W / 2;

        /* Fondu sur les bords uniquement */
        const t     = rawX / half;
        const alpha = Math.max(0, 1 - Math.abs(t) * 0.55);

        el.style.transform = `translateX(${screenX}px)`;
        el.style.opacity   = String(alpha);
        el.style.zIndex    = '1';
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [scrollEase, totalW, direction]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: CARD_H + 48,
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'pan-y',
        /* Les cartes sont en position absolue : sans ceci elles débordent
           horizontalement et créent un scroll parasite sur mobile/tablette. */
        overflow: 'hidden',
        /* Masque fondu sur les bords */
        maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          ref={el => { itemEls.current[i] = el; }}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: CARD_W,
            height: CARD_H,
            marginTop: -(CARD_H / 2),
            willChange: 'transform, opacity',
            transformOrigin: 'center center',
            borderRadius: 22,
            background: 'white',
            boxShadow: '0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: '2rem 1.6rem 1.8rem',
            textAlign: 'center',
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Cercle icône */}
          <div style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'rgba(227,6,19,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1.5px solid rgba(227,6,19,0.12)',
          }}>
            <img
              src={item.image}
              alt=""
              width={56}
              height={56}
              style={{ objectFit: 'contain', borderRadius: 0 }}
              loading="lazy"
            />
          </div>

          {/* Titre */}
          <span style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1d1d1f',
            lineHeight: 1.28,
          }}>
            {t(item.textKey, item.text)}
          </span>

          {/* Description */}
          {item.desc && (
            <span style={{
              fontSize: '0.8rem',
              color: '#8e8e93',
              lineHeight: 1.58,
            }}>
              {t(item.descKey, item.desc)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
