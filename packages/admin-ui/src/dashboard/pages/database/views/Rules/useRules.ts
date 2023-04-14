import { useClient } from "../../../../../lib/client";
import { useEffect, useState } from "react";

export const useRules = (collection: string | undefined) => {
    const client = useClient();
    const [rules, setRules] = useState<any>(undefined);

    useEffect(() => {
        //reset data
        if (rules) setRules(undefined)

        if (!collection) return;

        client.Collection(collection)
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
    }, [collection])

    return rules;
}