import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import makeMDNS = require("multicast-dns");

@Injectable()
export class AvahiClientService implements OnModuleInit, OnModuleDestroy {

    private mdns!: makeMDNS.MulticastDNS;

    onModuleInit() {
        this.mdns = makeMDNS();

        this.mdns.on('response', function (response: any) {
            console.log('got a response packet:', response)
        })

        this.mdns.on('query', function (query: any) {
            console.log('got a query packet:', query)
        })
    }

    onModuleDestroy() {
        this.mdns.destroy();
    }


    public async scan() {
        this.mdns.query({
            questions: [{
                name: '',
                type: 'ANY'
            }]
        } as any);
    }

    public async respond() {
        this.mdns.respond({
            answers: [{
                name: 'my-service',
                type: 'SRV',
                data: {
                    port: 9999,
                    weight: 0,
                    priority: 10,
                    target: 'my-service.example.com'
                }
            }, {
                name: 'brunhilde.local',
                type: 'A',
                ttl: 300,
                data: '192.168.1.5'
            }]
        })
    }
}