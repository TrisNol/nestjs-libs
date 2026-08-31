import { All, Controller, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { MCPHandler } from "./mcp-handler.service";

@Controller()
export class MCPController {
    constructor(private readonly mcpHandler: MCPHandler) { }

    @All('/mcp')
    async post(@Req() req: Request, @Res() res: Response) {
        await this.mcpHandler.fetch(req, res);
        return res;
    }
}