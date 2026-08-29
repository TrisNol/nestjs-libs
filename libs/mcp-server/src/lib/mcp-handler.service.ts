import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { createMcpHandler, McpServer, McpHttpHandler } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { toNodeHandler } from "@modelcontextprotocol/node";
import type { Request, Response } from "express";
import { DiscoveryService } from "@nestjs/core";
import { MCP_TOOL_KEY, McpTool, McpToolProvider } from "./mcp-tool.decorator";

@Injectable()
export class MCPHandler implements OnModuleInit {
    private readonly logger = new Logger(MCPHandler.name);
    private handler: McpHttpHandler = null as any;

    constructor(
        private readonly discoveryService: DiscoveryService
    ) { }
    onModuleInit() {
        const globalTools: { name: string, description: string, inputSchema: any, method: Function }[] = [];
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
        const handler = createMcpHandler(() => {
            const server = new McpServer({
                name: 'MCP Server', version: '1.0.0', description: 'A server for the Model Context Protocol', websiteUrl: 'localhost:3000'
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