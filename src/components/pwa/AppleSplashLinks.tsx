/**
 * iOS ne lit pas le manifest.json pour ses écrans de démarrage : il faut des
 * balises <link rel="apple-touch-startup-image"> explicites, une par taille
 * d'appareil, ciblées par media query. Composant serveur pur (aucune logique) —
 * Next.js App Router remonte automatiquement ces <link> dans le <head>.
 */
const SPLASH_SCREENS: { href: string; media: string }[] = [
  { href: '/splash/iphone-se.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' },
  { href: '/splash/iphone-11.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)' },
  { href: '/splash/iphone-xs.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)' },
  { href: '/splash/iphone-12-13.png', media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)' },
  { href: '/splash/iphone-14-15.png', media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)' },
  { href: '/splash/iphone-14-15-pro-max.png', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)' },
  { href: '/splash/ipad.png', media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2)' },
  { href: '/splash/ipad-pro-11.png', media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)' },
  { href: '/splash/ipad-pro-129.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)' },
];

export function AppleSplashLinks() {
  return (
    <>
      {SPLASH_SCREENS.map((s) => (
        <link key={s.href} rel="apple-touch-startup-image" href={s.href} media={s.media} />
      ))}
    </>
  );
}
