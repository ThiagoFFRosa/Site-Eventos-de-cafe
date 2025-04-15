const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const UserController = require('../controllers/UserController');

router.post('/register', UserController.register);
router.get('/session', UserController.getSessionUser);

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `foto_${Date.now()}${ext}`);
    }
  });

const upload = multer({ storage });

// Upload de foto
router.post('/configuracoes', upload.single('foto'), UserController.atualizarConfiguracoes);

// Atualizar configurações
router.put('/configuracoes', UserController.atualizarConfiguracoes);

module.exports = router;




