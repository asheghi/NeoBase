import { useParams } from "react-router-dom"

export const useCollection = (): string | undefined => {
    const params = useParams<{ collection: string }>();
    return params.collection;
}