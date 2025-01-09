import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from "typeorm";
import { Product } from "./ProductModel";
import { Bid } from "./BidModel";
import moment from "moment";
import { BaseModel } from "./BaseModel";

@Entity("auction")
export class Auction extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.auctions)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: "timestamp", name: "start_time" })
  startDateTime: string;

  @Column({ type: "timestamp", name: "end_time" })
  endDateTime: String;

  @Column({ name: "max_cycles" })
  maxCycles: number;

  @Column({ name: "auction_days" })
  auctionDays: number;

  @Column({ default: 0, name: "current_cycle" })
  currentCycle: number;

  @Column({
    type: "decimal",
    name: "base_price",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  basePrice: number;

  @Column({
    type: "decimal",
    name: "min_increment",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  minIncrement: number;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @Column({ default: true, name: "is_active" })
  isActive: number;
  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
