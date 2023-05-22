import { useApi } from "@neobase/client/react";
import { useEffect, useState } from "react"
import { IPermission } from "./interfaces/IPermission";
import { IRole } from "./interfaces/IRole";

export const useRoles = () => {
    const api = useApi();
    const [roles, setRoles] = useState<any[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [loading, setLoading] = useState(0);

    const isFetching = !!loading;

    const plusLoading = () => {
        setLoading((loading) => loading + 1)
    }

    const minusLoading = () => {
        setLoading((loading) => loading - 1)
    }

    const fetchRoles = async () => {
        try {
            plusLoading();
            const { data } = await api.AccessControl.getRoles()
            setRoles(data);
        } finally {
            minusLoading();
        }
    }

    const fetchPermissions = async () => {
        try {
            plusLoading();
            const { data } = await api.AccessControl.getAllPermissions()
            setPermissions(data);
        } finally {
            minusLoading();
        }

    }

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);


    const createRole = async (name: string) => {
        const { data } = await api.AccessControl.createRole(name);
        await fetchRoles();
        return data;
    }

    const deleteRole = async (role: IRole) => {
        const { data } = await api.AccessControl.deleteRole(role.name);
        await fetchRoles();
        return data;
    }

    const addPermission = async (role_id: string, { action, resource, filter }: { action: string, resource: string, filter?: any }) => {
        const { data: updatedRole } = await api.AccessControl.onRole(role_id).addPermission(action, resource, filter);
        setRoles(() => {
            const index = roles.findIndex(it => it._id === role_id);
            const temp = [...roles];
            temp.splice(index, 1, updatedRole);
            return temp;
        })
    }

    const deletePermission = async (role_id: string, { action, resource }: { action: string, resource: string, filter?: any }) => {
        const { data: updatedRole } = await api.AccessControl.onRole(role_id).deletePermission(action, resource);
        setRoles(() => {
            const index = roles.findIndex(it => it._id === role_id);
            const temp = [...roles];
            temp.splice(index, 1, updatedRole);
            return temp;
        })
    }


    const enablePermission = async (role_id: string, { action, resource }: { action: string, resource: string, filter?: any }) => {
        const { data: updatedRole } = await api.AccessControl.onRole(role_id).enablePermission(action, resource);
        setRoles(() => {
            const index = roles.findIndex(it => it._id === role_id);
            const temp = [...roles];
            temp.splice(index, 1, updatedRole);
            return temp;
        })
    }


    const disablePermission = async (role_id: string, { action, resource }: { action: string, resource: string, filter?: any }) => {
        const { data: updatedRole } = await api.AccessControl.onRole(role_id).disablePermission(action, resource);
        setRoles(() => {
            const index = roles.findIndex(it => it._id === role_id);
            const temp = [...roles];
            temp.splice(index, 1, updatedRole);
            return temp;
        })
    }

    console.log('isLoading:',isFetching);
    

    return {
        roles,
        createRole,
        deleteRole,
        addPermission,
        deletePermission,
        permissions,
        isLoading: isFetching,
        enablePermission,
        disablePermission,
    }
}