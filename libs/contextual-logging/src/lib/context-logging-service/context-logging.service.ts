import { ConsoleLogger, Injectable, NotImplementedException } from "@nestjs/common";

import { AsyncContext } from "../async-context-middleware/async-context";

@Injectable()
export class ContextLoggingService extends ConsoleLogger {
    
    constructor(
        private readonly asyncContext: AsyncContext
    ) {
        super();
    }

    private getCorrelationId(): string | undefined {
        return this.asyncContext.getCorrelationId();
    }

    override log(message: any, ...optionalParams: any[]) {
        const correlationId = this.getCorrelationId();
        super.log(`[${correlationId}] ${message}`, ...optionalParams);
    }
    override error(message: any, ...optionalParams: any[]) {
        const correlationId = this.getCorrelationId();
        super.error(`[${correlationId}] ${message}`, ...optionalParams);
    }
    override warn(message: any, ...optionalParams: any[]) {
        const correlationId = this.getCorrelationId();
        super.warn(`[${correlationId}] ${message}`, ...optionalParams);
    }
    override debug(message: any, ...optionalParams: any[]) {
        const correlationId = this.getCorrelationId();
        if(super.debug === undefined) {
            throw new NotImplementedException("The given Logger does not support debug messages");
        }
        super.debug(`[${correlationId}] ${message}`, ...optionalParams);
    }
    override verbose(message: any, ...optionalParams: any[]) {
        const correlationId = this.getCorrelationId();
        if(super.verbose === undefined) {
            throw new NotImplementedException("The given Logger does not support verbose messages");
        }
        super.verbose(`[${correlationId}] ${message}`, ...optionalParams);
    }
    override fatal(message: any, ...optionalParams: any[]) {
        const correlationId = this.getCorrelationId();
        super.fatal(`[${correlationId}] ${message}`, ...optionalParams);
    }

}