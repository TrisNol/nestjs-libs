import { DynamicModule, Module } from '@nestjs/common';
import { MCPHandler } from './mcp-handler.service';
import { MCPController } from './mcp.controller';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';

export interface McpServerModuleOptions {
  name: string;
  version: string;
  description: string;
  websiteUrl: string;
}

@Module({
})
export class McpServerModule {
  static forRoot(options: McpServerModuleOptions): DynamicModule {
    return {
      module: McpServerModule,
      imports: [DiscoveryModule],
      controllers: [MCPController],
      providers: [
        {
          provide: MCPHandler,
          inject: [DiscoveryService],
          useFactory: (discoveryService: DiscoveryService) =>
            MCPHandler.createMcpHandler(
              discoveryService,
              options.name,
              options.version,
              options.description,
              options.websiteUrl,
            ),
        },
      ],
      exports: [MCPHandler],
    };
  }
}
