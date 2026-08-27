import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Hand-rolled rather than pulling in @astrojs/sitemap: the site has one index
// page and one route per project, so the integration would be a dependency to
// generate nine lines of XML. Dependencies here are deliberately minimal.
//
// Lists only what should actually rank — the internal pages (/styles, /games,
// /og-card) are left out, matching public/robots.txt. Keep the two in step.
//
// No <lastmod>: nothing in the content schema records when a project was last
// edited, and a fabricated date is worse than an absent one — crawlers treat a
// lastmod that never matches reality as a reason to stop trusting the file.

const ORIGIN = 'https://hankduhaime.com';

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  const paths = [
    '/',
    ...projects.map(p => `/projects/${p.id.replace(/\.[^.]+$/, '')}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path => `  <url><loc>${ORIGIN}${path}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
