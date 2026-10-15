import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Save, ShieldCheck, ShoppingBag, MessageCircle, Search } from "lucide-react";
import { Field, PageHeader, Section } from "@/components/admin/SettingsField";
import { useSetting } from "@/hooks/use-setting";

export const Route = createFileRoute("/admin/settings/integrations")({ component: Page });

type V = {
  meta_business_id: string;
  meta_catalog_id: string;
  meta_page_id: string;
  meta_pixel_id: string;
  meta_domain_verification: string;
  google_merchant_id: string;
  google_site_verification: string;
  whatsapp_catalog_id: string;
};
const DEFAULTS: V = {
  meta_business_id: "", meta_catalog_id: "", meta_page_id: "", meta_pixel_id: "",
  meta_domain_verification: "", google_merchant_id: "", google_site_verification: "",
  whatsapp_catalog_id: "",
};
const input = "w-full border border-border rounded-md px-3 py-2 bg-background text-sm";

function Page() {
  const { value, setValue, save, loading, saving } = useSetting<V>("commerce_integrations", DEFAULTS);
  if (loading) return <div className="text-sm text-muted-foreground">Loading integration settings…</div>;
  const set = <K extends keyof V>(key: K, next: V[K]) => setValue({ ...value, [key]: next });
  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Commerce Integrations" description="Keep your Google, Meta, and WhatsApp catalogue details in one simple place." actions={
        <button onClick={() => save()} disabled={saving} className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm flex items-center gap-2 disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save settings"}
        </button>
      } />
      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed">
        <strong>Important:</strong> These fields store account identifiers and verification tokens for your setup. They do not sign in to Google or Meta or grant account access. Never enter passwords, access tokens, API secrets, or Supabase service-role keys here.
      </div>
      <Section title="Google Merchant Center" description="Use the same website and published product catalogue as your store.">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Merchant Center ID" hint="Numeric ID shown in your Merchant Center account."><input className={input} value={value.google_merchant_id} onChange={e => set("google_merchant_id", e.target.value)} maxLength={30} placeholder="e.g. 123456789" /></Field>
          <Field label="Search Console verification token" hint="HTML-tag content token only; do not paste the full tag."><input className={input} value={value.google_site_verification} onChange={e => set("google_site_verification", e.target.value)} maxLength={300} placeholder="Verification token" /></Field>
        </div>
        <div className="rounded-lg bg-background border border-border p-3 text-sm">
          <div className="font-medium mb-1">Product feed</div>
          <a className="text-primary underline break-all" href="https://indianhandicraftstandards.com/google-product-feed.xml" target="_blank" rel="noreferrer">https://indianhandicraftstandards.com/google-product-feed.xml <ExternalLink className="inline h-3 w-3" /></a>
          <p className="text-xs text-muted-foreground mt-1">The live URL must be checked after deployment before submitting it to Merchant Center.</p>
        </div>
        <a className="inline-flex items-center gap-2 text-sm text-primary underline" href="https://merchants.google.com/" target="_blank" rel="noreferrer"><Search className="h-4 w-4" /> Open Google Merchant Center</a>
      </Section>
      <Section title="Meta Commerce Manager" description="Record the IDs for the existing IHS business and product catalogue.">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Meta Business ID"><input className={input} value={value.meta_business_id} onChange={e => set("meta_business_id", e.target.value)} maxLength={40} placeholder="Business portfolio ID" /></Field>
          <Field label="Meta Catalogue ID"><input className={input} value={value.meta_catalog_id} onChange={e => set("meta_catalog_id", e.target.value)} maxLength={40} placeholder="Product catalogue ID" /></Field>
          <Field label="Facebook Page ID"><input className={input} value={value.meta_page_id} onChange={e => set("meta_page_id", e.target.value)} maxLength={40} placeholder="Facebook Page ID" /></Field>
          <Field label="Meta Pixel ID (optional)"><input className={input} value={value.meta_pixel_id} onChange={e => set("meta_pixel_id", e.target.value)} maxLength={40} placeholder="Numeric Pixel ID" /></Field>
        </div>
        <Field label="Meta domain verification token" hint="Paste only the verification token from Meta Business Settings. This field is for setup tracking; deployment configuration may still be required to publish the tag."><input className={input} value={value.meta_domain_verification} onChange={e => set("meta_domain_verification", e.target.value)} maxLength={300} placeholder="Verification token" /></Field>
        <div className="rounded-lg bg-background border border-border p-3 text-sm">
          <div className="font-medium mb-1">Product feed</div>
          <a className="text-primary underline break-all" href="https://indianhandicraftstandards.com/meta-product-feed.csv" target="_blank" rel="noreferrer">https://indianhandicraftstandards.com/meta-product-feed.csv <ExternalLink className="inline h-3 w-3" /></a>
          <p className="text-xs text-muted-foreground mt-1">Submit this as a scheduled data feed only after confirming the URL returns valid CSV.</p>
        </div>
        <a className="inline-flex items-center gap-2 text-sm text-primary underline" href="https://business.facebook.com/commerce/" target="_blank" rel="noreferrer"><ShoppingBag className="h-4 w-4" /> Open Meta Commerce Manager</a>
      </Section>
      <Section title="WhatsApp Business Catalogue" description="Use the business number already configured in Settings → WhatsApp.">
        <Field label="WhatsApp Catalogue ID (optional)" hint="If your Meta account exposes a separate catalogue ID for WhatsApp, record it here."><input className={input} value={value.whatsapp_catalog_id} onChange={e => set("whatsapp_catalog_id", e.target.value)} maxLength={40} placeholder="Catalogue ID" /></Field>
        <a className="inline-flex items-center gap-2 text-sm text-primary underline" href="https://business.facebook.com/" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> Open Meta Business Suite</a>
        <p className="text-xs text-muted-foreground">Catalogue linking and WhatsApp eligibility must be confirmed in the business account; saving an ID here does not link the catalogue automatically.</p>
      </Section>
      <Section title="Launch checklist" description="Use this checklist when reviewing the accounts.">
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Verify ownership of indianhandicraftstandards.com in Google Search Console and Meta Business Settings.</li>
          <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Confirm both product-feed URLs return valid, published products.</li>
          <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Add the feed URLs as data sources and resolve item diagnostics in Google and Meta.</li>
          <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Link the eligible Meta catalogue to WhatsApp Business and verify the catalogue in the WhatsApp app.</li>
        </ul>
      </Section>
    </div>
  );
}
