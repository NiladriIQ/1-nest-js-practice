import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HasingProvider {
    abstract hashPassword(data: string | Buffer): Promise<string>;
    abstract comparePassword(
        plainPassword: string | Buffer,
        hashedPassword: string
    ): Promise<boolean>;
}
