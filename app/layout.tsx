import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import { AppProvider } from '@/lib/app-provider'
import { CONFIG_PADRAO_SITE, mesclarConfigComPadrao } from '@/lib/site-config'
import { fetchSiteConfigServidor } from '@/lib/site-config-server'
import { SITE_DESCRICAO, SITE_NAME, SITE_NOME_LEGAL, SITE_TITULO_PADRAO, SITE_URL } from '@/lib/site-meta'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const script = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-script',
  style: ['italic', 'normal'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITULO_PADRAO,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRICAO,
  keywords: [
    'material didático',
    'educação infantil',
    'ensino fundamental',
    'educação ambiental',
    'plataforma educacional',
    'trilhas de aprendizagem',
    'material pedagógico',
    'Diversamente',
  ],
  authors: [{ name: SITE_NOME_LEGAL }],
  creator: SITE_NOME_LEGAL,
  publisher: SITE_NOME_LEGAL,
  applicationName: SITE_NAME,
  category: 'education',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITULO_PADRAO,
    description: SITE_DESCRICAO,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITULO_PADRAO,
    description: SITE_DESCRICAO,
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6eefb',
  width: 'device-width',
  initialScale: 1,
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organizacao`,
      name: SITE_NAME,
      legalName: SITE_NOME_LEGAL,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: SITE_DESCRICAO,
      email: 'ecosbioambiental@gmail.com',
      sameAs: ['https://wa.me/5519992101212'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organizacao` },
    },
  ],
}

// IDs das ferramentas de analytics — só carregam em produção (ver bloco abaixo)
// para não poluir os dados com sessões de desenvolvimento/preview.
const GA4_ID = 'G-0Y2X15G2MX'
const CLARITY_ID = 'y96gbwo13w'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Busca a config de aparência no servidor para a primeira renderização já
  // sair com o texto customizado pelo admin, sem o "flash" do texto padrão.
  const configServidor = await fetchSiteConfigServidor()
  const siteConfigInicial =
    configServidor && configServidor.home ? mesclarConfigComPadrao(configServidor) : CONFIG_PADRAO_SITE

  const emProducao = process.env.NODE_ENV === 'production'

  return (
    <html lang="pt-BR" className={`bg-background ${inter.variable} ${script.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          // JSON estático definido acima (sem dado de usuário) — seguro para injeção direta.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />

        <AppProvider initialSiteConfig={siteConfigInicial}>{children}</AppProvider>
        <Toaster position="top-center" />

        {emProducao ? (
          <>
            {/* Google tag (gtag.js) — Google Analytics 4 */}
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');`}
            </Script>

            {/* Microsoft Clarity — não injeta nenhuma UI visível no site para o visitante. */}
            <Script id="ms-clarity-init" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
