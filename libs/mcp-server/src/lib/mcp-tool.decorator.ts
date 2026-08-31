import { DiscoveryService } from '@nestjs/core';

export const McpToolProvider = DiscoveryService.createDecorator();

export const MCP_TOOL_KEY = 'MCP_TOOL';
export function McpTool(name: string, description: string, inputSchema?: any): MethodDecorator {
    return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(MCP_TOOL_KEY, { name, description, inputSchema }, descriptor.value);
    };
}