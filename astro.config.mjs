// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeRapide from "starlight-theme-rapide";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "context1000",
      description: "Architectural artifacts optimized for AI agents",
      plugins: [starlightThemeRapide()],
      customCss: ['./src/styles/custom.css'],
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/context1000" }],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "index" },
            { label: "Getting Started", slug: "guides/getting-started" },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Artifact Types", slug: "guides/artifact-types" },
            { label: "MCP Integration", slug: "guides/mcp-integration" },
            { label: "Examples", slug: "guides/examples" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Format Specification", slug: "reference/format-specification" },
            { label: "CLI Reference", slug: "reference/cli-reference" },
          ],
        },
      ],
    }),
  ],
});
