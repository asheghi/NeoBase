import { IContainer } from "./IContainer";
import { IPermission } from "./IPermission";
import { IRole } from "./IRole";

export interface IPermissionItemProps {
    permission: IPermission;
    container: IContainer;
    parentRole: IRole,
}
