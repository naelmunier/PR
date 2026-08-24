import { useEffect, useState } from 'react';

/** Renvoie une fonction de traduction qui se ré-évalue à chaque changement de langue. */
export function useI18n() {
  const [, bump] = useState(0);

  useEffect(() => {
    const onChange = () => bump(n => n + 1);
    /* L'événement est émis sur `document` et ne remonte pas jusqu'à window */
    document.addEventListener('i18n:changed', onChange);
    /* Le script i18n peut avoir déjà appliqué la langue avant l'hydratation React */
    onChange();
    return () => document.removeEventListener('i18n:changed', onChange);
  }, []);

  return (key: string | undefined, fallback: string) => {
    /* Rendu serveur : pas de window, on garde le texte français d'origine */
    if (!key || typeof window === 'undefined') return fallback;
    return (window as any).I18N?.t?.(key) ?? fallback;
  };
}
