### Find One 

Find one document, Mongoose [findOne](https://mongoosejs.com/docs/api.html#model_Model.findOne) equivalent.

**POST**  `{baseUrl}/{project}/{collection}/findOne`
##### Parameters

| Name       | Located in      | Description                                                                                                                                      | Required | Schema               |
|------------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------------------|
| filter     | body.filter     | Specifies selection filter using query operators. To return all documents in a collection, omit this parameter or pass an empty document ({}).   | No       | json                 |
| projection | body.projection | Specifies the fields to return in the documents that match the query filter. To return all fields in the matching documents, omit this parameter.| No       | string,json,string[] |

##### Responses

| Code | Description          | Schema |
| ---- |----------------------|--------|
| 200 | one documents        | json |
