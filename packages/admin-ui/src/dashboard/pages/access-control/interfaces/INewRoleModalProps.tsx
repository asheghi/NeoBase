import { Callback } from "./ICallback";
import { IContainer } from "./IContainer";

export interface INewRoleModalProps {
    show: boolean;
    onClose: Callback;
    container: IContainer;
}



