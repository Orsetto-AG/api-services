

import { Column } from "typeorm";
import { Exclude } from "class-transformer";
export abstract class BaseModel {
  @Exclude()
  @Column({ name: "created_by" })
  public createdBy: number;

  @Column({ name: "created_date", default: () => "CURRENT_TIMESTAMP" })
  public createdDate: string;

  @Exclude()
  @Column({ name: "modified_by" })
  public modifiedBy: number;

  @Exclude()
  @Column({
    name: "modified_date",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  public modifiedDate: string;
}
