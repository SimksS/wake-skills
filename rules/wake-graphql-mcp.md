# Rule: Use Wake GraphQL MCP Before Assuming Data

When a task involves dynamic Wake Commerce data, do not invent field names, types, arguments, or response shapes.

Before generating code that depends on Wake’s GraphQL API:

1. Identifique qual template, Page, Snippet, Component ou Block vai consumir o dado.
2. Liste os dados necessários em linguagem de negócio.
3. Use `wake-graphql-mcp` para confirmar o schema real.
4. Valide a query proposta quando possível.
5. Só então escreva o `.graphql`, o HTML/Scriban ou o código consumidor.

Expected tools:

- `wake_graphql_search`: localizar types/campos por texto.
- `wake_graphql_type`: inspecionar campos, argumentos e assinaturas de um type.
- `wake_graphql_query`: executar a query e conferir o JSON retornado.
- `wake_graphql_introspect`: obter uma visão geral do schema.

Use the real shape returned by the MCP as the source of truth to access `data`, define parameters, and handle nullability.
