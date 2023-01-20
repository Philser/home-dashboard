# Setup

To run the backend via Docker, you need to provide the following Env Vars:

#### DOMAIN
Domain to enable CORS for. Usually the URL of the website (including protocol), e.g. https://dashboard.philser.de

#### DB_USER
User name to use for authenticating with the MongoDB container

#### DB_PASSWORD
Password to use for authenticating with the MongoDB container

#### PORT
Port to listen on

#### DOCKERDIR
Path to the base of two external volumes that are being included into the container:
- `${DOCKERDIR}/dashboard/mongo`
    - Used for storing MongoDB data on disk
- `${DOCKERDIR}/dashboard/db/`
    - Used to store startup scripts (in `.js` or `.sh` format) for the DB
- `${DOCKERDIR}/dashboard/keys`
    - Used to store the SSL certificate for HTTPS support and the private key
        - `${DOCKERDIR}/dashboard/keys/cert.pem`
        - `${DOCKERDIR}/dashboard/keys/cert_key.pem`
    - Used to store the RSA keypair for creating JWTs
        - `${DOCKERDIR}/dashboard/keys/private.pem`
        - `${DOCKERDIR}/dashboard/keys/public.pem`

# Local Development
### Keys & Certificate
To quickly generate RSA keys for local development, run:
```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

To generate a certificate and the respective key, run: 
```
openssl req -x509 \
            -sha256 -days 356 \
            -nodes \
            -newkey rsa:2048 \
            -keyout rootCA.key -out rootCA.crt
```

### Running locally
To run the setup locally, run:
```
DOCKERDIR=./dockerdir DB_USER=user DB_PASSWORD=password PORT=4848 docker compose -f docker-compose.local.yml up
```

Standard login credentials are `user:password`.

# MongoDB Setup
Example setup.js:
```Javascript
db.createUser(
{
    user: "user",
    pwd: "password",
    roles: [{ role: 'readWrite', db: 'dashboard' }]
})

db = new Mongo().getDB("dashboard");

db.createCollection("user")

db.user.insert([
        {
                "username": "user",
                "passwordHash": "bcryptedPassword"
        }
])
```