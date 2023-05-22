import { useApi } from "@neobase/client/react";
import { useEffect, useState } from "react";

export const useUsers = (collection?: string, documentId?: string) => {
    const client = useApi();
    const [users, setUsers] = useState<any>(undefined);

    const deleteUser = (index: number) => {
        const temp = [...users];
        temp.splice(index, 1)
        setUsers(temp)
    }

    const fetch = () => {
        client.Admin.Users.find()
            .then(
                ({ data }) => {
                    setUsers(data)
                },
                () => {
                    console.error('ridi')
                    setUsers(undefined)
                }
            )
    }

    useEffect(() => {
        //reset data
        if (users) setUsers(undefined)

        fetch();

    }, [collection, documentId])

    const updateUser = async (uid: string, payload: any) => {
        const { data } = await client.Admin.Users.updateUser(uid, payload);
        console.log('check:', data);
    }

    const createUser = async (payload: any) => {
        await client.Admin.Users.newUser(payload);
        fetch();
    }

    return { deleteUser, users, createUser, updateUser };
}