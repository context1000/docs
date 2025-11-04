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
            { label: "Local RAG Setup", slug: "getting-started/local-rag" },
            { label: "Claude Code Plugin", slug: "getting-started/claude-code-plugin" },
          ],
        },
        {
          label: "Core Concepts",
          items: [
            { label: "Overview", slug: "core-concepts/overview" },
            { label: "Decisions", slug: "core-concepts/decisions" },
            { label: "Rules", slug: "core-concepts/rules" },
            { label: "Guides", slug: "core-concepts/guides" },
            { label: "Projects", slug: "core-concepts/projects" },
          ],
        },
        {
          label: "Guides",
          items: [
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
