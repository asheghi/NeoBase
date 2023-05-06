import { useApi } from "../../../../../lib/client";
import { useEffect, useState } from "react";

export const useDocument = (collection?: string, documentId?: string) => {
    const client = useApi();
    const [doc, setDoc] = useState<any>(undefined);

    useEffect(() => {
        //reset data
        if (doc) setDoc(undefined)

        if (!collection || !documentId) return;

        client.Collection(collection)
            .findOne({ _id: documentId })
            .then(
                ({ data }) => {
                    setDoc(data)
                },
                () => {
                    console.error('ridi')
                    setDoc(undefined)
                })
    }, [collection, documentId])

    return doc;
}