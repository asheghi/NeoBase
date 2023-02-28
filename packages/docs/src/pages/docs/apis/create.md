### Create

Save one or more documents to the database

**POST**  `{baseUrl}/{project}/{collection}/create`
##### Parameters

| Name     | Located in | Description   | Required | Schema      |
|----------|------------|---------------| -------- |-------------|
| document | body       | new document. | No | json,json[] |    

##### Responses

| Code | Description        | Schema  |
| ---- |--------------------|---------|
| 200 | count of document  | integer |
