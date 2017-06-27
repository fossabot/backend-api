"use strict";

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import config from "../lib/config";
import { connection } from "../lib/db";

@Entity()
export default class User {
  constructor(email: string) {
    this.email = email;
  }
  @PrimaryGeneratedColumn()
  public id: number;
  @Column({ length: 50, nullable: false, unique: true })
  public email: string;
  @Column({ name: "password", type: "string" })
  public hashedPassword: string;
  public setPassword = async (password: string) => {
    this.hashedPassword = await bcrypt.hash(password, config.get("password_hash_rounds"));
  }
  public checkPassword = async (password: string) =>
    bcrypt.compare(password, this.hashedPassword)
  @CreateDateColumn()
  public createdAt: Date;
  @UpdateDateColumn()
  public updatedAt: Date;
}
