# mcp-server

This library was generated with [Nx](https://nx.dev).

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

@Injectable()
@McpToolProvider()
export class SomeMCPMagics{
	@McpTool("heresy", "Heresy detected")
    async heresy(input: { text: string }) {
        return { content: [{ type: 'text', text: `Saved: ${input.text}` }] };
    }
}
```

The module serves MCP requests at
`/mcp`.

## Running unit tests

Run `nx test mcp-server` to execute the unit tests via [Jest](https://jestjs.io).
