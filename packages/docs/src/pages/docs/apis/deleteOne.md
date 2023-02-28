### Delete One

Deletes the first document that matches `filter` from the collection.

**POST**  `{baseUrl}/{project}/{collection}/deleteOne`
##### Parameters

| Name   | Located in | Description                 | Required | Schema      |
|--------|------------|-----------------------------|----------|-------------|
| filter | body       | Specifies selection filter. | No       | json,json[] |    

##### Responses

| Code | Description                                                                       | Schema |
| ---- |-----------------------------------------------------------------------------------|--------|
| 200 | object with the property deletedCount indicating how many documents were deleted. | json   |
