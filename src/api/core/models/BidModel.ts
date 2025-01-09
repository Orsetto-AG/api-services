import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Auction } from "./AuctionModel";
import { Customer } from "./Customer";
import { BaseModel } from "./BaseModel";
import moment from "moment";

@Entity("bid")
export class Bid extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "auction_id" })
  auctionId: number;

  @Column({ name: "bidder_id" })
  bidderId: number;

  @ManyToOne(() => Auction, (auction) => auction.bids)
  @JoinColumn({ name: "auction_id" })
  auction: Auction;

  @ManyToOne(() => Customer, (customer) => customer.bids)
  @JoinColumn({ name: "bidder_id" })
  customer: Customer;

  @Column({
    type: "decimal",
    name: "initial_bid_amount",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  initialBidAmount: number;

  @Column({
    type: "decimal",
    nullable: true,
    name: "current_bid_amount",
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  currentBidAmount: number | null;

  @Column({
    type: "decimal",
    nullable: true,
    name: "max_bid_amount",
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  maxBidAmount: number | null;

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
