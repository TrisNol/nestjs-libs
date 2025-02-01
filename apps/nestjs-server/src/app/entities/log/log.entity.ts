import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DeviceEntity } from "../device/device.entity";

@Entity()
export class LogEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    deviceId: string;

    @ManyToOne(() => DeviceEntity, device => device.logs)
    device: DeviceEntity;

    @Column({ nullable: false})
    timestamp: Date;

    @Column({ nullable: false})
    severity: string;

    @Column({ nullable: false})
    message: string;
}