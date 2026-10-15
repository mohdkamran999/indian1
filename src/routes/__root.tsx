import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";

// Optional commerce and search verification values. These are public site IDs/tokens, never secrets.
const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID ?? "").trim();
const META_DOMAIN_VERIFICATION = (import.meta.env.VITE_META_DOMAIN_VERIFICATION ?? "").trim();
const GOOGLE_SITE_VERIFICATION = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ?? "").trim();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Indian Handicraft Standards — Authentic Lucknowi Chikankari" },
      { name: "description", content: "Authentic hand-embroidered Lucknowi Chikankari kurtis, sarees, sharara sets & more. Trusted by 10,000+ customers since 2015." },
      { name: "author", content: "Indian Handicraft Standards" },
      ...(META_DOMAIN_VERIFICATION ? [{ name: "facebook-domain-verification", content: META_DOMAIN_VERIFICATION }] : []),
      ...(GOOGLE_SITE_VERIFICATION ? [{ name: "google-site-verification", content: GOOGLE_SITE_VERIFICATION }] : []),
      { property: "og:title", content: "Indian Handicraft Standards — Authentic Lucknowi Chikankari" },
      { property: "og:description", content: "Authentic hand-embroidered Lucknowi Chikankari kurtis, sarees, sharara sets & more. Trusted by 10,000+ customers since 2015." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Indian Handicraft Standards" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@IndianHandicraftStandards" },
      { name: "twitter:title", content: "Indian Handicraft Standards — Authentic Lucknowi Chikankari" },
      { name: "twitter:description", content: "Authentic hand-embroidered Lucknowi Chikankari kurtis, sarees, sharara sets & more. Trusted by 10,000+ customers since 2015." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/ae05ffb4-5e65-4994-9186-3bb0354f4448" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/ae05ffb4-5e65-4994-9186-3bb0354f4448" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Lato:wght@300;400;500;700;900&family=Archivo+Black&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Indian Handicraft Standards",
          url: "https://indianhandicraftstandards.com",
          logo: "https://indianhandicraftstandards.com/favicon.ico",
          sameAs: [],
        }),
      },
      {
        type: "text/javascript",
        children: "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NGJKBBQK');",
      },
      {
        type: "text/javascript",
        src: "https://www.googletagmanager.com/gtag/js?id=G-HC5QHDQQN0",
        async: true,
      },
      {
        type: "text/javascript",
        children: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-HC5QHDQQN0');",
      },
      ...(META_PIXEL_ID && /^\d{10,20}$/.test(META_PIXEL_ID) ? [{
        type: "text/javascript",
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
      }] : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NGJKBBQK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
