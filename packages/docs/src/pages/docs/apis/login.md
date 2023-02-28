### Login

used to authenticate users in your application, currently only basic authentication (email,password) is supported.

to make authenticated requests, you must add header `x-auth-token` with token value returned by this api.


**POST**  `{baseUrl}/{project}/login`
##### Parameters

| Name     | Located in    | Description    | Required | Schema |
|----------|---------------|----------------|----------|--------|
| email    | body.email    | user email.    | Yes      | string |    
| password | body.password | user password. | Yes      | string |    

##### Responses

| Code | Description            | Schema                       |
|------|------------------------|------------------------------|
| 200  | successfully logged in | { token: string }            |
| 400  | login failed           | { success: boolean = false } |
