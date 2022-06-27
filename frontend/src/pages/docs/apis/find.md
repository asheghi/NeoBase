### Find

Find documents, Mongoose [find](https://mongoosejs.com/docs/api.html#model_Model.find) equivalent.

**POST**  `{baseUrl}/{project}/{collection}/find`
##### Parameters

| Name       | Located in         | Description                                                                                                                                      | Required | Schema  |
|------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------| -------- |---------|
| filter     | body.filter        | Specifies selection filter using query operators. To return all documents in a collection, omit this parameter or pass an empty document ({}).   | No | json    |
| projection | body.projection    | Specifies the fields to return in the documents that match the query filter. To return all fields in the matching documents, omit this parameter.| No | string  ,json,string[]  |
| sort       | body.options.sort  | Orders the documents. corresponds to the ORDER BY statement in SQL.                                                                              | No | json    |
| skip       | body.options.skip  | Controls the starting point of the results.                                                                                                      | No | integer |
| limit      | body.options.limit | Limits the number of documents in the result.  corresponds to the LIMIT statement in SQL.                                                        | No | integer |

##### Responses

| Code | Description                 | Schema |
| ---- |-----------------------------|--------|
| 200 | paginated documents         | json[] |
