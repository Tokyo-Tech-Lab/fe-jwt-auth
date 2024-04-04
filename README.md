# fe-jwt-auth

FE jwt auth library

## Install

```bash
$ npm i fe-jwt-auth --save
```

## Usage

```js
import {initService, axiosInstance} from 'fe-jwt-auth';

initService({
    headers: {
        'x-timezone': '+07',
    },
    requestOptions: {
        baseUrl: 'http://localhost:3000/api'
    },
    events: {
        onLogout: () => {
            // handle logout
        },
        onForbidden: () => {
            // handle forbidden
        }
    }
})

// call api
const uses = await axiosInstance.get('/users')
```

## Options

| Key  |  Default   |  Definition   |
| -------- | ----------  | ----------  |
| requestOptions | {headers: {'Content-Type': 'application/json',},responseType: 'json'} | AxiosRequestConfig |
| refreshTokenTimeBufferInSecond | 0 | Time buffer in second. |
| localStorageAuthService | localStorageAuthServiceDefault | ILocalStorageAuthService |
| headers |  | Custom request header. |
| events |  | Handle on logout or forbidden  |
| refreshTokenRoute | /auth/refresh-token | Url path to refresh token |
| accessTokenKey | accessToken.token | key to get access token |
| refreshTokenKey | refreshToken.token | key to get refresh token |

### ILocalStorageAuthService

| Key  |  Definition   |
| -------- | ----------  |
| getAccessToken | () => string |
| setAccessToken | (token: string) => void; |
| getRefreshToken | () => string; |
| setRefreshToken | (token: string) => void; |
| resetAll | () => void; |
