import {useEffect, useState} from "react";
import {useClient} from "../../../../../lib/client";

export const useCollections = () => {
    const [search, setSearch] = useState();
    const client = useClient();
    const [collections, setCollections] = useState<{name:string}[]>([]);

    function fetchCollections() {
        client.Admin.Collection.getListOfCollections().then(({data}) => {
            setCollections(data);
        });
    }

    useEffect(function () {
        fetchCollections();
        return () => {
            //
        };
    }, []);

    return {
       search,
       setSearch,
        collections,
    }
}