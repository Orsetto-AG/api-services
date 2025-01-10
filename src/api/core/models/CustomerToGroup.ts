

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer_to_group')
export class CustomerToGroup {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'customer_group_id' })
    public customerGroupId: number;

    @Column({ name: 'customer_id' })
    public customerId: number;

    @Column({ name: 'is_active' })
    public isActive: number;
}
