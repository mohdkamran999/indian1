import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, CircleAlert, Copy, ExternalLink, Facebook, Globe, MessageCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/channels")({
  component: ChannelsPage,
  head: () => ({ meta: [{ title: "Sales Channels · IHS Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
});

function ChannelsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://indianhandicraftstandards.com";
  const feeds = [
    { id: "google", title: "Google Merchant Center", subtitle: "XML product feed", url: `${origin}/google-shopping.xml`, icon: Globe, steps: ["Open Merchant Center → Products → Data sources.", "Add a product source using Scheduled fetch.", "Paste this URL and set a daily fetch schedule."] },
    { id: "meta", title: "Meta Commerce Manager", subtitle: "CSV catalogue feed", url: `${origin}/meta-catalog.csv`, icon: Facebook, steps: ["Open Commerce Manager → Catalog → Data sources.", "Choose Data feed and scheduled upload.", "Paste this URL and complete Meta’s catalogue review."] },
  ];

  async function copy(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      toast.success("Feed URL copied");
      window.setTimeout(() => setCopied((current) => current === id ? null : current), 1800);
    } catch {
      toast.error("Copy was blocked by the browser. Select and copy the URL manually.");
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">Growth · Commerce channels</p>
        <h1 className="font-display text-3xl text-primary mt-1">Sales channel connections</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">Manage the feed URLs used to publish your catalogue to Google and Meta. Your brand design and About page remain part of the IHS storefront.</p>
      </header>

      <div className="rounded-xl border border-amber-300/60 bg-amber-50/70 dark:bg-amber-950/20 p-4 flex gap-3">
        <CircleAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Account authorization is still required</p>
          <p className="text-sm text-muted-foreground mt-1">These feed URLs do not mean your Google or Meta account is connected yet. First deploy the build, test each URL, then add it inside the relevant commerce account and complete its verification/review.</p>
        </div>
      </div>

      <section className="grid md:grid-cols-2 gap-4">
        {feeds.map((feed) => {
          const Icon = feed.icon;
          return (
            <article key={feed.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
                  <div><h2 className="font-semibold">{feed.title}</h2><p className="text-xs text-muted-foreground">{feed.subtitle}</p></div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-1 text-[10px] font-semibold"><CircleAlert className="h-3 w-3" /> Setup needed</span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Catalogue feed URL</p>
                <p className="text-xs break-all font-mono">{feed.url}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={() => copy(feed.id, feed.url)} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-3 py-2 text-xs font-medium"><Copy className="h-3.5 w-3.5" /> {copied === feed.id ? "Copied" : "Copy URL"}</button>
                  <a href={feed.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium"><ExternalLink className="h-3.5 w-3.5" /> Test feed</a>
                </div>
              </div>
              <ol className="space-y-2">
                {feed.steps.map((step, i) => <li key={step} className="flex gap-2 text-sm"><span className="h-5 w-5 rounded-full border border-border flex items-center justify-center text-[10px] shrink-0">{i + 1}</span><span className="text-muted-foreground">{step}</span></li>)}
              </ol>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3"><MessageCircle className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">WhatsApp Business</h2><p className="text-sm text-muted-foreground">Customer chat and catalogue</p></div></div>
        <p className="text-sm text-muted-foreground mt-3">Keep your existing WhatsApp Business number and catalogue. Use the WhatsApp settings page to configure the click-to-chat link. Meta’s catalogue and WhatsApp catalogue may share a catalogue only after you authorize that connection inside Meta Business Suite.</p>
        <a href="/admin/settings/whatsapp" className="inline-flex items-center gap-2 mt-4 rounded-full border border-border px-4 py-2 text-sm">Open WhatsApp settings <ExternalLink className="h-3.5 w-3.5" /></a>
      </section>

      <section className="rounded-xl border border-border p-5">
        <div className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" /><h2 className="font-semibold">Before enabling scheduled sync</h2></div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
          <li>Publish products only after price, stock, images and product details are correct.</li>
          <li>Use public HTTPS product image URLs that Google and Meta can fetch.</li>
          <li>Test the feed after deployment; a missing server database configuration returns an error instead of a misleading empty catalogue.</li>
          <li>Complete domain verification, shipping/returns policies and account review in each commerce platform.</li>
        </ul>
      </section>
    </div>
  );
}
