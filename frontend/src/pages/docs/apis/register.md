### Register

used to register new users in your application, currently only basic authentication (email,password) is supported.

to make authenticated requests, you must add header `x-auth-token` with token value returned by this api or `Login`.


**POST**  `{baseUrl}/{project}/register`
##### Parameters

| Name     | Located in    | Description    | Required | Schema |
|----------|---------------|----------------|----------|--------|
| email    | body.email    | user email.    | Yes      | string |    
| password | body.password | user password. | Yes      | string |    

##### Responses

| Code | Description             | Schema                       |
|------|-------------------------|------------------------------|
| 200  | successfully registered | { token: string }            |
| 400  | register failed         | { success: boolean = false } |
