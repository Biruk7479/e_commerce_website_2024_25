import { Model } from 'mongoose';
import { Strategy } from 'passport-jwt';
import { User } from './schemas/user.schma';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userModel;
    constructor(userModel: Model<User>);
    validate(payload: any): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
}
export {};
