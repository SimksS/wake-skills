# Wake Skills

Collection of Agent Skills and Rules for Wake Storefront SSR projects.

This repository is meant to be consumed by installers/CLIs via NPX and by IDEs or agents that load skill/rule directories. Each skill directory contains a `SKILL.md` with actionable instructions and, when needed, a `reference.md` with supporting details.

## Instalação via NPX (CLI)

Este pacote publica um comando `wake-skills` para instalar/copiar as skills e rules para um projeto.

### Instalar no padrão `.agents` (default)

```bash
npx wake-skills install
```

Isso copia:

- `wake-*/` -> `.agents/skills/wake-*/`
- `rules/*.mdc` -> `.agents/rules/*.mdc`

### Instalar para Cursor (preset)

```bash
npx wake-skills install --target cursor
```

### Customizar destino e paths

```bash
npx wake-skills install --target custom --dest . --skills-dir .agents/skills --rules-dir .cursor/rules
```

### Verificar configuração (sem escrever)

```bash
npx wake-skills doctor --target cursor
npx wake-skills install --dry-run
```

## Catalog

- `wake-queries`: create and wire GraphQL queries in `Queries/`.
- `wake-components`: create and register components in `Components/` and `Configs/components.json`.
- `wake-snippets`: dynamic post-render HTML using `Snippets/`, `/snippet`, and `client.snippet.render`.
- `wake-blocks`: CMS-editable blocks using `Blocks/<type>.html` and `Blocks/<type>.schema.json`.
- `wake-store-builtins`: use built-in variables injected into the `store` object inside Scriban templates.
- `wake-performance`: Page Speed optimization, images, responsive banners, scripts, and “hotsite-style” search.
- `rules/wake-graphql-mcp.mdc`: cross-cutting rule to validate real Wake Commerce data via MCP before generating code.
- `rules/wake-scriban.mdc`: cross-cutting rule to write HTML templates with Scriban and access injected objects in `underscore_case`.

## Expected Structure

```text
wake-skills/
  README.md
  rules/
    wake-graphql-mcp.mdc
    wake-scriban.mdc
  wake-queries/
    SKILL.md
    reference.md
  wake-components/
    SKILL.md
    reference.md
  wake-snippets/
    SKILL.md
    reference.md
  wake-blocks/
    SKILL.md
    reference.md
  wake-store-builtins/
    SKILL.md
    reference.md
  wake-performance/
    SKILL.md
    reference.md
```

## Skill Contract

Each `SKILL.md` must include:

- Frontmatter with `name` and `description`.
- Third-person description: what the skill does and when it should be used.
- A `When to use` section with clear triggers for the agent.
- An `Expected outcome` section with verifiable deliverables.
- An ordered execution flow that avoids assumptions.
- A final validation checklist.
- A direct link to `reference.md` when supporting material exists.

## Real Data Rule

Whenever a task involves dynamic Wake Commerce data, the agent must use `wake-graphql-mcp` before writing any query, template, or consumer code.

The MCP is the source of truth for:

- field names;
- arguments;
- types;
- nullability;
- object/list structure;
- the real JSON response shape used via `data`.

## How an Agent Should Work

1. Detect which skill applies based on the user request and the files being touched.
2. Read the relevant `SKILL.md` before editing.
3. Read `reference.md` only when additional detail is needed.
4. Apply `rules/wake-graphql-mcp.mdc` when Wake Commerce data is involved.
5. Make small, coherent changes aligned with Wake’s structure.
6. Validate against the skill checklist before finishing.

## When to Create a New Skill

Create a new skill when a Wake domain has its own contract, its own files, or its own workflow. Don’t mix unrelated topics that lead to different decisions.

Good candidates:

- global theme/layout;
- checkout;
- menus and navigation;
- analytics/events;
- external integrations;
- deployment/build.

Avoid creating a new skill for a small variation that fits as a section or example inside an existing skill.

## Writing Style

- Write in clear, direct English.
- Use relative paths with `/`.
- Prefer verifiable steps over long explanations.
- Say what the agent must do, in which order, and how to validate.
- Don’t rely on implicit knowledge when the Wake contract requires a specific file, folder, or field.
