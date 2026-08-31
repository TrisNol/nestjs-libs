# mcp-server

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro) has become the golden standard for connecting AI agents to remote systems by creating a generic interface that abstracts away from the specifics of the underlying system hosting the MCP server. This `mcp-server` library provides a way to equip a NestJS service with such an interface to open up one's app to AI agents.

## Usage

Import the module with the server metadata for the application:

```typescript
import { McpServerModule } from '@org/mcp-server';

@Module({
	imports: [
		McpServerModule.forRoot({
			name: 'My MCP Server',
			version: '1.0.0',
			description: 'Tools exposed by my application',
			websiteUrl: 'https://example.com',
		}),
	],
})
export class AppModule {}
```

Decorate injectable providers with `@McpToolProvider()` and their methods with
`@McpTool()` to expose them as MCP tools:
```typescript
import { Injectable } from "@nestjs/common";
import { McpTool, McpToolProvider } from "@org/mcp-server";
import * as z from "zod/v4";

@Injectable()
@McpToolProvider()
export class SomeMCPMagics{
	@McpTool(
		"heresy",
		"Heresy detected",
		z.object({ text: z.string().min(1).max(100) }),
	)
    async heresy(input: { text: string }) {
        return { content: [{ type: 'text', text: `Saved: ${input.text}` }] };
    }
}
```

Pass a Zod v4 schema as the optional third argument to `@McpTool()`. The schema
is published as the tool's MCP `inputSchema` and validates tool arguments before
the decorated method is called.

The module serves MCP requests at
`/mcp`.

## Running unit tests

Run `nx test mcp-server` to execute the unit tests via [Jest](https://jestjs.io).
