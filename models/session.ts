"use strict";

import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import config from "../lib/config";
import { connection } from "../lib/db";
import User from "./user";
import * as uuid from "uuid/v4";

// tslint:disable:max-classes-per-file
// tslint:disable-next-line:no-namespace
export namespace Errors {
  export class UserNotFoundError extends Error {
    public token: string;
    public uid: number;
    constructor(sid: string, uid: number) {
      super(`invalid entry uid=${uid} for session ${sid}`);
      this.name = "UserNotFoundForSessionError";
      this.token = sid;
      this.uid = uid;
    }
  }
  export class TokenExpiredError extends Error {
    public expiredAt: Date;
    public currentTime: Date;
    constructor(expiresAt: Date) {
      super(`token expired at ${expiresAt.toJSON}`);
      this.name = "TokenExpiredError";
      this.expiredAt = expiresAt;
      this.currentTime = new Date(Date.now());
    }
  }
}

@Entity()
export default class Session {
  constructor(uid: number) {
    this.uid = uid;
    this.token = uuid();
  }
  private getNewExpirationDate = () => new Date(Date.now() + Math.round(config.get("token_expires") / 1000));

  @Column({ type: "int" })
  public uid: number;
  @PrimaryColumn()
  public token: string;
  @Column({ type: "boolean" })
  public adminPermission = false;
  @CreateDateColumn()
  public createdAt: Date;
  @UpdateDateColumn()
  public updatedAt: Date;
  @Column({ type: "datetime" })
  public expiresAt = this.getNewExpirationDate();

  public checkValidation = async () => {
    if (this.expiresAt <= new Date(Date.now)) {
      throw new Errors.TokenExpiredError(this.expiresAt);
    }
    const user = await connection.getRepository(User).findOneById(this.uid);
    if (!user) {
      throw new Errors.UserNotFoundError(this.token, this.uid);
    }
    return true;
  }
  public renew = () => {
    this.expiresAt = this.getNewExpirationDate();
  }

  public toView = async () => {
    const user = await connection.getRepository(User).findOneById(this.uid);
    if (!user) {
      throw new Errors.UserNotFoundError(this.token, this.uid);
    } else {
      return {
        token: this.token,
        user: user.toView(),
        permissions: {
          admin: this.adminPermission,
        },
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        expiresAt: this.expiresAt,
      };
    }
  }
}
