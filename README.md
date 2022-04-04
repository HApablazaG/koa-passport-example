# koa-passport-example
Example for local authentication with a postgres database.

## Setup steps
1. Clone this repository.
    ```sh
    git clone git@github.com:HApablazaG/koa-passport-example.git
    ```
2. Install the npm packages.
    ```sh
    cd koa-passport-example
    npm install
    ```
3. Create the database and tables (see file _db.sql_).
4. Edit the file _src/config.json_, set the _dbUri_ parameter with the correspondig database connection string.
5. Run the server.
    ```sh
    npm start
    ```

## Test commands
```sh
# Login request
curl --location --request POST 'http://localhost:8080/auth/login' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'username=test' --data-urlencode 'password=test' --verbose
# Copy the values for koa.sess and koa.sess from the 'Set-Cookie' headers on the response.

# Test the login status for the login request.
# Set the corresponding koa.sess and koa.sess values.
curl --location --request GET 'http://localhost:8080/auth/login-status' --header 'Cookie: koa.sess=RETURNED_HEADER_VALUE; koa.sess.sig=RETURNED_HEADER_VALUE'

# Test a logout request
# Set the corresponding koa.sess and koa.sess values.
curl --location --request GET 'http://localhost:8080/auth/logout' --header 'Cookie: koa.sess=RETURNED_HEADER_VALUE; koa.sess.sig=RETURNED_HEADER_VALUE'

# Check the login status again.
# Set the corresponding koa.sess and koa.sess values.
curl --location --request GET 'http://localhost:8080/auth/login-status' --header 'Cookie: koa.sess=RETURNED_HEADER_VALUE; koa.sess.sig=RETURNED_HEADER_VALUE'
```
