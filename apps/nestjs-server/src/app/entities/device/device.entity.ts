import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LogEntity } from "../log/log.entity";

@Entity()
export class DeviceEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    serialNumber: string;

    @OneToMany(() => LogEntity, log => log.device, {
        cascade: true,
        eager: false,
        onDelete: "CASCADE"
    })
    logs: LogEntity[];
}