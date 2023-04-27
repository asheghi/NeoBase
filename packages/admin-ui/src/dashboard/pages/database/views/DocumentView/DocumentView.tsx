import {useParams} from "react-router-dom";
import {useDocument} from "./useDocument";

export const DocumentView = () => {
    const {collection,documentId} = useParams<{collection:string; documentId:string}>();
    const document = useDocument(collection,documentId);

    return <div>
        Document view
        <br/>
        <pre>{JSON.stringify(document,null,2)}</pre>
    </div>
}