import { SITE_NAME } from '@/lib/site-meta'

/**
 * Marcação compartilhada pelas duas imagens de preview (app/opengraph-image.tsx
 * e app/twitter-image.tsx), geradas via next/og (Satori) — cores em hex porque
 * o Satori não interpreta oklch(), as variáveis de cor usadas no resto do site.
 */
export function OgImageElement() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #fbd6e3 0%, #ead6f2 35%, #cdeaf7 70%, #cdf0dc 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.72)',
          borderRadius: 40,
          padding: '64px 96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 104,
            fontStyle: 'italic',
            fontWeight: 700,
            color: '#b23d78',
            letterSpacing: '-0.02em',
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 34,
            fontWeight: 500,
            color: '#3f3038',
            textAlign: 'center',
          }}
        >
          Material didático organizado por trilhas
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 24,
            fontWeight: 400,
            color: '#6b5760',
            textAlign: 'center',
          }}
        >
          Educação Infantil, Ensino Fundamental I e Educação Ambiental
        </div>
      </div>
    </div>
  )
}
