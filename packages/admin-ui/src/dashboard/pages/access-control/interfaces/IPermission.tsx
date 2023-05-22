export interface IPermission {
    enabled: boolean;
    action: string;
    resource: string;
    filter?: string;
}
