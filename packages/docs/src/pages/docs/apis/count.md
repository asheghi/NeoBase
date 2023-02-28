### Count

Count number of documents that match filter in a database collection, Mongoose [count](https://mongoosejs.com/docs/api.html#model_Model.count) equivalent.

**POST**  `{baseUrl}/{project}/{collection}/count`
##### Parameters

| Name          | Located in  | Description                                        | Required | Schema  |
|---------------|-------------|----------------------------------------------------| -------- |---------|
| filter        | body.filter | Specifies selection filter using query operators.  | No | json    |

##### Responses

| Code | Description       | Schema  |
| ---- |-------------------|---------|
| 200 | count of document | integer |
