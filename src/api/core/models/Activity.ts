

import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('activity')
export class Activity {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'customer_activity_id' })
    public customerActivityId: number;
    @IsNotEmpty()
    @Column({ name: 'activity_name' })
    public activityName: string;

    @Column({ name: 'is_active' })
    public isActive: number;
}
