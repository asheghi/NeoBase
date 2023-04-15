import { useClient } from "../../../../../lib/client";
import { useEffect, useState } from "react";

export const useRules = (collection: string | undefined) => {
    const client = useClient();
    const [rules, setRules] = useState<any>(undefined);

    const fetch = () => {
        //reset data
        if (rules) setRules(undefined)

        if (!collection) return;

        client.Collection(collection!)
            .AccessControl
            .getAccessConfig()
            .then(
                ({ data }) => {
                    setRules(data)
                },
                () => {
                    console.error('ridi')
                    setRules(undefined)
                })
    }

    useEffect(() => {
        fetch();
    }, [collection])

    return { rules, refetch: fetch };
}