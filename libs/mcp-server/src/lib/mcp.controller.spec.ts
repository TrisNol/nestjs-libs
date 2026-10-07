import { Test, TestingModule } from '@nestjs/testing';
import { MCPHandler } from './mcp-handler.service';
import { MCPController } from './mcp.controller';

describe(MCPController.name, () => {
    let controller: MCPController;
    let mcpHandler: { fetch: jest.Mock };

    beforeEach(async () => {
        mcpHandler = {
            fetch: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MCPController],
            providers: [{ provide: MCPHandler, useValue: mcpHandler }],
        }).compile();

        controller = module.get<MCPController>(MCPController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should fowrad all incoming requests to the MCPHandler', async () => {
        const req = { body: { message: 'Cthulhu fhtagn' } } as any;
        const res = { send: jest.fn() } as any;

        await controller.post(req, res);

        expect(mcpHandler.fetch).toHaveBeenCalledWith(req, res);
    });
});