"use strict";

import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import config from "../lib/config";
import { connection } from "../lib/db";
import User from "./user";
import * as uuid from "uuid/v4";
import ms = require("ms");
import IPermission from "./IPermission";
import log from "../lib/log";

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
  constructor(user: User) {
    if (user) {
      this.uid = user.id;
      this.token = uuid();
    }
  }
  private getNewExpirationDate = () =>
    new Date(Date.now() + ms(config.get("token_expires") as string))

  @Column({ type: "int" })
  public uid: number;
  @PrimaryColumn()
  public token: string;
  @Column({ type: "jsonb" })
  public permissions: IPermission = { admin: false };
  @CreateDateColumn()
  public createdAt: Date;
  @UpdateDateColumn()
  public updatedAt: Date;
  @Column()
  public expiresAt: Date = this.getNewExpirationDate();
  public get expired() {
    return this.expiresAt <= new Date(Date.now());
  }

  public getUser = async () => {
    if (this.expired) {
      throw new Errors.TokenExpiredError(this.expiresAt);
    }
    const user = await connection.getRepository(User).findOneById(this.uid);
    if (!user) {
      throw new Errors.UserNotFoundError(this.token, this.uid);
    } else {
      return user;
    }
  }
  public renew = () => {
    this.expiresAt = this.getNewExpirationDate();
  }

  public toView = async () => {
    const user = await this.getUser();
    return {
      token: this.token,
      user: user.toView(),
      permissions: this.permissions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      expiresAt: this.expiresAt,
    };
  }
}
