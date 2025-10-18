## Setup self-signed certificate

### 1. Install mkcert
```sh
brew install mkcert
```

### 2. Create a local Certificate Authority
```sh
mkcert -install
```

### 3. Generate certificate for localhost
```sh
mkcert localhost 127.0.0.1
```

You should have the files `localhost-key.pem` and `localhost.pem`. Move these under `.ssh` folder in your root directory and git will ignore them.

### 4. Configure apps to use the self-signed certificate