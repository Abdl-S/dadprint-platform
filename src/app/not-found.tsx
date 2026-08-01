/**
 * 404 racine — filet de sécurité pour les URLs qui ne correspondent à aucune
 * langue (ex: erreur de lien externe). La vraie 404 vécue par les visiteurs
 * passe par app/[locale]/not-found.tsx, dans leur langue.
 */
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '80px 20px' }}>
        <p>404 — Page introuvable</p>
        <a href="/fr">Retour à l'accueil</a>
      </body>
    </html>
  );
}
