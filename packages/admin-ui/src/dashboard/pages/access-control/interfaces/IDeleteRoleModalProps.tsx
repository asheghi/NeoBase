import { Callback } from "./ICallback";
import { IContainer } from "./IContainer";
import { IRole } from "./IRole";



export interface IDeleteRoleModalProps {
    show: boolean;
    onClose: Callback;
    container: IContainer;
    role: IRole,
}
