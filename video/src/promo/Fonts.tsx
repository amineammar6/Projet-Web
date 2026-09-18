import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {F} from './theme';

const css = `
@font-face {
  font-family: 'Inter';
  src: url('${staticFile('fonts/inter.woff2')}') format('woff2');
  font-weight: 100 900;
  font-display: block;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('${staticFile('fonts/jbmono.woff2')}') format('woff2');
  font-weight: 100 800;
  font-display: block;
}
`;

/**
 * Injects the variable fonts and holds rendering until they are actually
 * rasterised, so no frame is captured with a fallback face.
 */
export const Fonts: React.FC = () => {
  const [handle] = useState(() => delayRender('loading fonts'));

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await Promise.all([
        document.fonts.load(`400 16px ${F.sans}`),
        document.fonts.load(`700 16px ${F.sans}`),
        document.fonts.load(`400 16px ${F.mono}`),
      ]);
      await document.fonts.ready;
      if (!cancelled) continueRender(handle);
    };
    load().catch(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return <style>{css}</style>;
};
