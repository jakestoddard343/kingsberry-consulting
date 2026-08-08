import { site, services } from "@/lib/content";

/** Structured data so the consultancy and its services are machine-readable. */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.positioning,
    email: site.email,
    telephone: site.phone,
    areaServed: "US",
    slogan: site.tagline,
    knowsAbout: [
      "AI lead generation",
      "Marketing automation",
      "Salesforce administration",
      "HubSpot implementation",
      "CRM optimization",
      "Revenue operations",
      "Customer experience analytics",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marketing operations services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.summary,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Content is fully static and authored in-repo, so there is no injection surface.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
