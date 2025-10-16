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

### 4. Configure apps to use the self-signed certificate