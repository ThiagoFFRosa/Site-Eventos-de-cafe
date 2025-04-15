const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const validarCPF = require('../utils/validarCPF');
const db = require('../db/connection');
const multer = require('multer');
const path = require('path');

class UserController {
  static async register(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    try {
      const senhaHash = await bcrypt.hash(senha, 10);
      const userId = await UserModel.create({ nome, email, senhaHash });
      res.json({ message: "Usuário cadastrado com sucesso!", userId });
    } catch (err) {
      console.error("Erro ao registrar usuário:", err);
      res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  }

  static async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios!" });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(400).json({ error: "Credenciais inválidas" });

      const isMatch = await bcrypt.compare(senha, user.senha);
      if (!isMatch) return res.status(400).json({ error: "Credenciais inválidas" });

      req.session.userId = user.id;
      console.log("Login OK - Session salva:", req.session); // <-- adiciona isso
      res.json({ message: "Login bem-sucedido!" });
    } catch (err) {
      console.error("Erro no login:", err);
      res.status(500).json({ error: "Erro ao realizar login" });
    }
  }

  static async getSessionUser(req, res) {
    console.log('Session atual:', req.session);
    if (!req.session.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }
  
    try {
      const user = await UserModel.findById(req.session.userId);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  
      // 🔐 envia só os dados que precisa no front
      res.json({
        nome: user.nome,
        email: user.email,
        foto_url: user.foto_url,
        cpf: user.cpf
      });
    } catch (err) {
      console.error("Erro ao buscar usuário da sessão:", err);
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }
  

  static logout(req, res) {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: "Erro ao encerrar sessão" });
      res.clearCookie('connect.sid', { path: '/' }); // remove o cookie da session
      res.json({ message: "Logout realizado com sucesso" });
    });
  }

  static uploadFoto(req, res) {
    if (!req.session.userId || !req.file) {
      return res.status(400).json({ error: 'Usuário não autenticado ou sem imagem' });
    }

    const caminho = `/uploads/${req.file.filename}`;
    const sql = 'UPDATE users SET foto_url = ? WHERE id = ?';
    db.query(sql, [caminho, req.session.userId], (err) => {
      if (err) {
        console.error('Erro ao salvar imagem:', err);
        return res.status(500).json({ error: 'Erro ao salvar imagem' });
      }
      res.json({ message: 'Foto atualizada com sucesso!', url: caminho });
    });
  }

  static async atualizarConfiguracoes(req, res) {
    const { nome, senha_antiga, senha_nova, cpf } = req.body;
    const userId = req.session.userId;
  
    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });
  
    db.query('SELECT * FROM users WHERE id = ?', [userId], async (err, result) => {
      if (err || !result.length) return res.status(500).json({ error: 'Usuário não encontrado' });
  
      const user = result[0];
  
      // Atualiza nome
      if (nome && nome !== user.nome) {
        db.query('UPDATE users SET nome = ? WHERE id = ?', [nome, userId]);
      }
  
      // Atualiza senha
      if (senha_antiga && senha_nova) {
        const match = await bcrypt.compare(senha_antiga, user.senha);
        if (!match) return res.status(400).json({ error: 'Senha antiga incorreta' });
  
        const novaHash = await bcrypt.hash(senha_nova, 10);
        db.query('UPDATE users SET senha = ? WHERE id = ?', [novaHash, userId]);
      }
  
      // Atualiza CPF (se ainda não tiver)
      if (!user.cpf && cpf) {
        if (!validarCPF(cpf)) return res.status(400).json({ error: 'CPF inválido' });
        db.query('UPDATE users SET cpf = ?, usuario_valido = 1 WHERE id = ?', [cpf, userId]);
      }
  
      // Atualiza foto se foi enviada
      if (req.file) {
        const caminho = `/uploads/${req.file.filename}`;
        db.query('UPDATE users SET foto_url = ? WHERE id = ?', [caminho, userId]);
        return res.json({ message: 'Dados e foto atualizados com sucesso!', url: caminho });
      }
  
      res.json({ message: 'Dados atualizados com sucesso!' });
    });
  }

  static async register(req, res) {
    const { nome, email, senha } = req.body;
  
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }
  
    try {
      const senhaHash = await bcrypt.hash(senha, 10);
      const userId = await UserModel.create({ nome, email, senhaHash });
      res.json({ message: "Usuário cadastrado com sucesso!", userId });
    } catch (err) {
      console.error("Erro ao registrar usuário:", err);
      res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  }
  
  
}


module.exports = UserController;
