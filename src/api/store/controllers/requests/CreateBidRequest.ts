import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateBidRequest {
  @IsNotEmpty()
  public auctionId: number;

  @IsNotEmpty()
  public bidderId: number;

  @IsNotEmpty()
  public bidAmount: number;
}
