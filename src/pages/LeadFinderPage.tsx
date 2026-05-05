import { SEO } from "../components/SEO";
import { LeadFinder } from "../components/LeadFinder";

export function LeadFinderPage() {
  return (
    <>
      <SEO
        title="Lead Finder - Admin"
        description="Internal tool for finding qualified video leads"
        url="https://mobiledwellings.media/leads"
      />
      <LeadFinder />
    </>
  );
}
