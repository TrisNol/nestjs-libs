import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { createMcpHandler, McpServer, McpHttpHandler } from '@modelcontextprotocol/server';
import { toNodeHandler } from "@modelcontextprotocol/node";
import type { Request, Response } from "express";
import { DiscoveryService } from "@nestjs/core";
import { MCP_TOOL_KEY, McpToolProvider } from "./mcp-tool.decorator";

@Injectable()
export class MCPHandler implements OnModuleInit {
    private readonly logger = new Logger(MCPHandler.name);
    private handler: McpHttpHandler = null as any;


    private constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly serverSettings: { name: string, version: string, description: string, websiteUrl: string }
    ) { }

    static createMcpHandler(discoveryService: DiscoveryService, name: string, version: string, description: string, websiteUrl: string): MCPHandler {
        return new MCPHandler(
            discoveryService,
            { name, version, description, websiteUrl }
        );

    }

    onModuleInit() {
        const globalTools: { name: string, description: string, inputSchema: any, method: (input: any) => Promise<any> }[] = [];
        // Tools must be services --> get providers
        const decoratedToolProviders = this.discoveryService.getProviders({ metadataKey: McpToolProvider.KEY });
        decoratedToolProviders.forEach(provider => {
            const instance = provider.instance;
            if (!instance) {
                throw new Error(`Provider ${provider.name} has no instance`);
            }
            // One ToolProvider may host several tools
            Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(methodName => {
                const method = instance[methodName];
                // Only functions may be decorated with @McpTool
                if (typeof method === 'function') {
                    // Check for the @McpTool decorator metadata as we are also iterating over any other functions (e.g. the constructor)
                    const result = Reflect.getMetadata(MCP_TOOL_KEY, method);
                    if (!result) {
                        return;
                    }
                    if (!result.name || !result.description) {
                        throw new Error(`Tool ${methodName} in provider ${provider.name} is missing name or description`);
                    }
                    this.logger.log(`Registered tool: ${result.name} via provider: ${provider.name}`);
                    globalTools.push({ name: result.name, description: result.description, inputSchema: result.inputSchema, method: method.bind(instance) });
                }
            });
        });
        this.logger.log(`Creating MCP Server with name: ${this.serverSettings.name}, version: ${this.serverSettings.version}, description: ${this.serverSettings.description}, websiteUrl: ${this.serverSettings.websiteUrl}`);
        const handler = createMcpHandler(() => {
            const server = new McpServer({
                name: this.serverSettings.name,
                version: this.serverSettings.version,
                description: this.serverSettings.description,
                websiteUrl: this.serverSettings.websiteUrl
            });
            for (const tool of globalTools) {
                server.registerTool(tool.name, {
                    description: tool.description,
                    inputSchema: tool.inputSchema
                }, async (input: any) => tool.method(input));
            }
            return server;
        }
        );
        this.handler = handler;
    }

    get httpHandler() {
        return this.handler;
    }

    async fetch(req: Request, res: Response): Promise<void> {
        await toNodeHandler(this.handler, { onerror: (error) => Logger.error(error) })(req, res, req.body);
    }
}