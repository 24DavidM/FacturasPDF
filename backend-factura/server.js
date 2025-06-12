import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./router/facturaRoutes.js";

const app = express();
dotenv.config();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
  res.send("Hola a testear");
});

export default app
