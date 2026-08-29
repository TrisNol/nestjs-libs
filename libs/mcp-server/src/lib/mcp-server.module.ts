import { Module } from '@nestjs/common';
import { MCPHandler } from './mcp-handler.service';
import { MCPController } from './mcp.controller';
import { DiscoveryService } from '@nestjs/core';

@Module({
  controllers: [MCPController],
  providers: [MCPHandler, DiscoveryService],
  exports: [],
})
export class McpServerModule {}
