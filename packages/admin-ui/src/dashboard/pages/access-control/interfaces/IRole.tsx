import { IPermission } from "./IPermission";

export interface IRole {
    _id: string;
    name: string;
    permissions?: IPermission[];
}
