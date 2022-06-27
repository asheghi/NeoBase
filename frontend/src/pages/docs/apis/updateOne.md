### Update One

update only the first document that matches filter

**POST**  `{baseUrl}/{project}/{collection}/updateOne`
##### Parameters

| Name   | Located in  | Description           | Required | Schema |
|--------|-------------|-----------------------|----------|--------|
| filter | body.filter | selection filter.     | No       | json   |    
| update | body.update | MongoDB update object | No       | json   |    

##### Responses

| Code | Description                                   | Schema |
|------|-----------------------------------------------|--------|
| 200  | object containing matchedCount, modifiedCount | json   |
