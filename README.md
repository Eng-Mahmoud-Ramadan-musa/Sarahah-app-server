# Sarahah App Server

This is the backend server for the Sarahah App.

## How to run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Docker

To build and run with Docker:

```bash
docker build -t sarahah-server .
docker run -p 5000:5000 sarahah-server
```
