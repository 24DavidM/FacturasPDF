import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import facturaRoutes from './router/facturaRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', facturaRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.set('port', process.env.PORT || 3000);

export default app;
