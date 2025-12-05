import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import ServerlessHttp from "serverless-http";

const tokenStore = new Map();
const app = express();
const PORT = process.env.PORT || 4000;

// CORS;
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://lexicon-iframe.netlify.app",
  "https://jf-iframe-web-component.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) == -1) {
      const msg =
        "The CORS policy for this site has not configured this Origin";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/.netlify/functions/api", (req, res) => {
  return res.json({
    message: "hello world",
  });
});

app.post("/.netlify/functions/api/v1/submit", (req, res) => {
  const { cardNumber, cvv } = req.body;

  // Simulate Tokenization with third party payment processor
  const maskedCard = cardNumber.slice(-4).padStart(cardNumber.length, "X");
  const maskedCVV = cvv.slice(-4).padStart(cardNumber.length, "X");
  const paymentToken = `tok_${randomUUID()}`;

  // save in memory
  tokenStore.set(paymentToken, {
    maskedCard,
    maskedCVV,
    timestamp: new Date().toISOString(),
  });

  // simulating processing time
  setTimeout(() => {
    res.status(200).json({
      status: "success",
      message: "Data was tokenized successfully.",
      data: {
        paymentToken: paymentToken,
        maskedCVV,
        maskedCard,
      },
    });
  }, 1000);
});

app.get("/.netlify/functions/api/v1/tokens/:id", () => {
  const token = req.params.token;

  if (tokenStore.has(token)) {
    res.status(200).json({
      status: "success",
      data: tokenStore.get(token),
    });
  } else {
    res.status(404).json({
      error: "Token not found.",
    });
  }
});

const serverlessHandler = ServerlessHttp(app);

export const handler = async (event, context) => {
  const result = await serverlessHandler(event, context);
  return result;
};
