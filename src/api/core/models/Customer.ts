import {
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import * as bcrypt from "bcrypt";
import moment = require("moment/moment");
import { Exclude } from "class-transformer";
import { Order } from "./Order";
import { Vendor } from "./Vendor";
import { IsNotEmpty } from "class-validator";
import { ProductViewLog } from "./productViewLog";
import { ExportLog } from "./ExportLog";
import { Bid } from "./BidModel";

@Entity("customer")
export class Customer extends BaseModel {
  public static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  public static comparePassword(
    user: Customer,
    password: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(password, user.password, (err, res) => {
        resolve(res === true);
      });
    });
  }

  @IsNotEmpty()
  @PrimaryGeneratedColumn({ name: "id" })
  public id: number;
  @IsNotEmpty()

  //----- REGISTER INFO-----
  @IsNotEmpty()
  @Exclude()
  @Column({ name: "password" })
  public password: string;
  @IsNotEmpty()
  @Column({ name: "email" })
  public email: string;

  @Exclude()
  @Column({ name: "is_accepted_term_and_conditions", default: false })
  public isAcceptedTermAndConditions: boolean;
  //------ END REGISTER INFO-----

  //--------PERSONAL INFO -----------
  @Column({ name: "gender" })
  public gender: string;

  @Column({ name: "first_name" })
  public firstName: string;

  @Column({ name: "last_name" })
  public lastName: string;

  @Column({ name: "username" })
  public username: string;

  @Column({ name: "birthday" })
  public birthday: string;

  @Column({ name: "street" })
  public street: string;

  @Column({ name: "street_number" })
  public streetNumber: string;

  @Column({ name: "zip_code" })
  public zipCode: string;

  @Column({ name: "city" })
  public city: string;

  @Column({ name: "country" })
  public country: string;

  @Column({ name: "other_address_info" })
  public otherAddressInfo: string;
  //-------- END PERSONAL INFO -----------

  //--------COMPANY INFO -----------

  @Column({ name: "company_name" })
  public companyName: string;

  @Column({ name: "is_vat_chargeable", default: false })
  public isVatChargeable: boolean;

  @Column({ name: "vat_number" })
  public vatNumber: string;

  @Column({ name: "is_trade_registered", default: false })
  public isTradeRegistered: boolean;

  @Column({ name: "trade_registered_number" })
  public tradeRegisteredNumber: string;

  @Column({ name: "is_register_owner", default: false })
  public isRegisterOwner: boolean;

  @Column({ name: "register_person_name" })
  public registerPersonName: string;

  @Column({ name: "register_person_surname" })
  public registerPersonSurname: string;

  @Column({ name: "register_person_sex" })
  public registerPersonSex: string;

  //--------END COMPANY INFO -----------

  // ------- STATUS INFO--------------------------------

  @Exclude()
  @Column({ name: "delete_flag" })
  public deleteFlag: number;

  @Column({ name: "is_active" })
  public isActive: number;

  @Column({ default: false, name: "is_company" })
  public isCompany: boolean;

  @Column({ default: false, name: "is_completed_personal_info" })
  public isCompletedPersonalInfo: boolean;

  @Column({ default: false, name: "is_completed_company_info" })
  public isCompletedCompanyInfo: boolean;

  @Column({ default: false, name: "is_completed_phone_otp_verification" })
  public isCompletedPhoneOtpVerification: boolean;

  @Column({ default: false, name: "is_completed_kyc_verification" })
  public isCompletedKycVerification: boolean;

  @Column({ default: false, name: "is_completed_address_verification" })
  public isCompletedAddressVerification: boolean;

  @Column({ default: false, name: "is_completed_email_otp_verification" })
  public isCompletedEmailOtpVerification: boolean;
  // ---- END STATUS INFO--------------------------------

  // ------- AUTH INFO--------------------------------
  @Column({ name: "last_login" })
  public lastLogin: string;

  @Exclude()
  @Column({ name: "forget_password_key" })
  public forgetPasswordKey: string;

  @Exclude()
  @Column({ name: "forget_password_link_expires" })
  public linkExpires: string;
  // ------- END AUTH INFO--------------------------------

  @OneToMany((type) => Order, (order) => order.customer)
  public order: Order[];

  @OneToOne((type) => ExportLog, (exportLog) => exportLog.user)
  public exportLog: ExportLog;

  @OneToMany(
    (type) => ProductViewLog,
    (productviewlog) => productviewlog.customer
  )
  public productviewlog: ProductViewLog[];

  @OneToOne((type) => Vendor)
  public vendor: Vendor;

  @OneToMany(() => Bid, (bid) => bid.customer)
  public bids: Bid[];

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
