import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/constants/constants';
import { ActiveUserType } from '../interfaces/active-user-type.interface';

export const ActiveUser = createParamDecorator((
    field: keyof ActiveUserType | undefined,
    ctx: ExecutionContext,
) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserType = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
});
