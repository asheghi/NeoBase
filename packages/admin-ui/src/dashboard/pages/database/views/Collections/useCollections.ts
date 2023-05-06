import { useEffect, useState } from "react";
import { useApi } from "../../../../../lib/client";

export const useCollections = () => {
    const [search, setSearch] = useState();
    const client = useApi();
    const [collections, setCollections] = useState<{ name: string }[]>([]);

    function fetchCollections() {
        client.Admin.Collection.getListOfCollections().then(({ data }) => {
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