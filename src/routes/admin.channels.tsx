import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MessageCircle, RefreshCw, ShieldCheck, ShoppingBag, AlertCircle, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/admin/channels")({
  component: ChannelsPage,
  head: () => ({
    meta: [
      { title: "Sales Channels · IHS Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function Step({ done, title, detail }: { done: boolean; title: string; detail: string }) {
  const Icon = done ? CheckCircle2 : Circle;
  return (
    <div className="flex gap-3">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${done ? "text-emerald-600" : "text-muted-foreground"}`} />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function ChannelsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Store management</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sales channels</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Manage the channels where your IHS products are discovered. A channel is only marked connected after account authorization and a real catalogue sync have been verified.
        </p>
      </div>

      <section className="rounded-xl border border-amber-300/70 bg-amber-50/70 p-4 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h2 className="text-sm font-semibold">WhatsApp catalogue connection required</h2>
            <p className="mt-1 text-sm leading-6">
              This project page does not yet have verified Meta authorization or a completed product sync. Opening WhatsApp Manager is a setup step, not proof of a connection. Do not treat chat links as catalogue synchronization.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-3"><MessageCircle className="h-6 w-6 text-emerald-600" /></div>
              <div>
                <h2 className="font-semibold">WhatsApp Business catalogue</h2>
                <p className="text-sm text-muted-foreground">Product catalogue and availability sync</p>
              </div>
            </div>
            <span className="rounded-full border border-amber-300 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-200">Not connected</span>
          </div>
          <div className="mt-5 space-y-4">
            <Step done={false} title="Authorize the correct Meta Business" detail="Choose the business portfolio, WhatsApp Business Account, and catalogue owned by IHS." />
            <Step done={false} title="Match the IHS product catalogue" detail="Map products, variants, images, prices, stock availability, and product links to the selected catalogue." />
            <Step done={false} title="Run and verify the first sync" detail="Review item-level errors and confirm the last successful sync before showing Connected." />
          </div>
          <a href="https://business.facebook.com/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            Open Meta Business <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3"><ShoppingBag className="h-6 w-6 text-blue-600" /></div>
            <div>
              <h2 className="font-semibold">Meta Commerce Manager</h2>
              <p className="text-sm text-muted-foreground">Facebook and Instagram product discovery</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p>Connect the correct commerce account and catalogue. Check that each product meets Meta’s commerce policies and has a working product page.</p>
            <p>Catalogue review, account permissions, and product approval are controlled by Meta and cannot be confirmed by this website alone.</p>
          </div>
          <a href="https://business.facebook.com/commerce/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-secondary">
            Open Commerce Manager <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-sky-500/10 p-3"><ShieldCheck className="h-6 w-6 text-sky-600" /></div>
            <div>
              <h2 className="font-semibold">Google Merchant Center</h2>
              <p className="text-sm text-muted-foreground">Shopping listings and product feed</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p>Verify the website, shipping and returns policies, and product data. Import the configured feed only after its public endpoint is tested.</p>
            <p>Product approval and account diagnostics must be checked inside Merchant Center.</p>
          </div>
          <a href="https://merchants.google.com/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-secondary">
            Open Merchant Center <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-violet-500/10 p-3"><RefreshCw className="h-6 w-6 text-violet-600" /></div>
            <div>
              <h2 className="font-semibold">Sync health</h2>
              <p className="text-sm text-muted-foreground">Last run, failures, and manual resync</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-dashed p-4">
            <div className="text-sm font-medium">No verified sync history</div>
            <p className="mt-1 text-sm text-muted-foreground">Sync history will appear after a server-side integration is authorized and its first run completes.</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Circle className="h-3.5 w-3.5" /> No product sync has been verified from this panel.</div>
        </section>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Before enabling live sync</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="text-sm font-medium">Secure authorization</div>
            <p className="mt-1 text-sm text-muted-foreground">Keep Meta access tokens server-side. Never paste secrets into the browser or a public VITE variable.</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="text-sm font-medium">Product mapping</div>
            <p className="mt-1 text-sm text-muted-foreground">Use stable product IDs and variant SKUs so repeated syncs update items rather than creating duplicates.</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="text-sm font-medium">Real status</div>
            <p className="mt-1 text-sm text-muted-foreground">Show authorization, feed, and item errors separately. Never show Connected before a successful verification.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
