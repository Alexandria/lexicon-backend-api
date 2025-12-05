💳 Lexicon Backend API (Serverless Function)

#### Deployment

The API is deployed as a single Netlify Function named api (based on the file
structure functions/api.js). Base URL:
https://delightful-sfogliatella-9483bf.netlify.app/.netlify/functions/api

#### API endpoints

- **POST /v1/submit/api/v1/submit**: Simulate Tokenization with third party
  payment processor and saves to a map
- **GET /v1/tokens/{token_id}**: Retrieves the masked details associated with a
  given paymentToken.
