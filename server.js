const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventoRoutes = require('./routes/eventos');

const app = express();
const PORT = 3000;

// CORS com sessão habilitada
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS bloqueado'));
      }
    },
    credentials: true
  }));
  

app.use(express.json());

app.use(session({
  secret: 'chave-bem-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/eventos', eventoRoutes);

// Fallback
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🔥 API rodando em http://localhost:${PORT}`);
});
