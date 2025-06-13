import mongoose from 'mongoose';
import app from './server.js';

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/tu_basedatos';

mongoose.connect(mongoURL)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(app.get('port'), () => {
      console.log(`Servidor escuchando en puerto ${app.get('port')}`);
    });
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err);
  });
