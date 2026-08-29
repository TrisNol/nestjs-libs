import { Injectable } from "@nestjs/common";
import { McpTool, McpToolProvider } from "@org/mcp-server";

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

    @McpTool("another", "here we go again")
    async another(input: { text: string }) {
        return { content: [{ type: 'text', text: `Another tool saved: ${input.text}` }] };
    }

    @McpTool("one-more", "third time's the charm")
    async oneMore(input: { text: string }) {
        return { content: [{ type: 'text', text: `One more tool saved: ${input.text}` }] };
    }
}