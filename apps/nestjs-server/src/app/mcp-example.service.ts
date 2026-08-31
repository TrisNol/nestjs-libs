import { Injectable } from "@nestjs/common";
import { McpTool, McpToolProvider } from "@org/mcp-server";
import * as z from 'zod/v4';

@Injectable()
@McpToolProvider()
export class HeresyTool {

    @McpTool("heresy", "Heresy detected")
    async heresy(input: { text: string }) {
        return { content: [{ type: 'text', text: `Saved: ${input.text}` }] };
    }
}

@Injectable()
@McpToolProvider()
export class AnotherTool {

    @McpTool("another", "here we go again", z.object({ text: z.string().min(1).max(100) }))
    async another(input: { text: string }) {
        return { content: [{ type: 'text', text: `Another tool saved: ${input.text}` }] };
    }

    @McpTool("one-more", "third time's the charm", z.object({ howOften: z.number().min(1).max(10) }))
    async oneMore(input: { howOften: number }) {
        return { content: [{ type: 'text', text: `One more tool saved: ${input.howOften}` }] };
    }
}