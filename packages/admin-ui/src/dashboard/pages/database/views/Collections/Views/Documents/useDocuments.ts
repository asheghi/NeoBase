import { useEffect, useState } from "react";
import { useClient } from "../../../../../../../lib/client";

export const useDocuments = (collection?: string, pageSize: number = 10) => {
    const client = useClient();
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const pageCount = count ? Math.ceil((count) / pageSize) : 1;
    const from = (page * pageSize) + 1;
    const to = Math.min(from + pageSize, count);

    const reset = () => {
        setQuery("");
        setPage(0);
    }

    const nextPage = () => {
        if (page < pageCount - 1) {
            setPage(page + 1)
        }
    }
    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    }

    useEffect(() => {
        if (!collection) {
            console.log('no collection was passed!');
            return;
        }
        const Collection = client.Collection(collection);
        // reset documents
        if (documents.length) {
            setDocuments([]);
        }
        if (count) {
            setCount(0);
        }
        setIsLoading(true);
        let q = query && query.length ? JSON.parse(query) : {};

        (async () => {
            Promise.all([
                Collection
                    .find(q)
                    // .projection({ _id: 1 })
                    .limit(pageSize)
                    .skip(from - 1)
                    .then(({ data }: any) => {
                        setDocuments(data)
                        return Promise.resolve();
                    }),
                Collection.count(q)
                    .then(({ data }) => {
                        setCount(data)
                        return Promise.resolve();
                    })
            ])
                .finally(() => {
                    setIsLoading(false);
                })
        })();


    }, [collection, page, query]);

    const find = (q: string) => {
        setQuery(q);
        setPage(0);
    }

    const isResetAvailable = (page !== 0) || (query && query.length);

    console.log('check available: ', isResetAvailable);
    console.log('page:', page);
    console.log('query:', query, !!query);



    return {
        documents, isLoading, find,
        prevPage, nextPage, pageCount, page,
        count, from, to,
        reset,
        isResetDisabled : !isResetAvailable,
    };
}