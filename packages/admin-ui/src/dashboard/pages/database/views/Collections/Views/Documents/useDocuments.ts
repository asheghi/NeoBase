import {useEffect, useState} from "react";
import {useClient} from "../../../../../../../lib/client";

export const useDocuments = (collection?: string): any[] => {
    if(!collection) return [];
    const client = useClient();
    const [documents,setDocuments] = useState<any[]>([]);

    useEffect( () => {
        if(documents.length ){
            setDocuments([]);
        }
        client.Collection(collection).find({},{_id:1})
            .then(({data}) =>{
                setDocuments(data)
            },() =>{
                // ridi
            });
    },[collection]);

    return documents;
}