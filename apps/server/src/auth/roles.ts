import { SetMetadata } from "@nestjs/common";

export enum Role {
    Admin = 'ADMIN',
    Individual = 'INDIVIDUAL',
    Enterprise = 'ENTERPRISE'
}

export const Roles = (...roles:Role[]) => SetMetadata('roles',roles)