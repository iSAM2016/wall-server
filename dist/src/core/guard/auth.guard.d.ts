import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export declare class RolesGuard implements CanActivate {
    private errMissingAuthorization;
    private errInvalidBearer;
    private errInvalidToken;
    private required;
    checkBearerLegal(request: Request): string;
    checkUserExist(jwtDecoded: any): Promise<any>;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
