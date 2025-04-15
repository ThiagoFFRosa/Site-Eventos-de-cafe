const db = require('../db/connection');

class UserModel {
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE email = ?";
      db.query(sql, [email], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT nome, email, foto_url,cpf FROM users WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }

  static create({ nome, email, senhaHash }) {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO users (nome, email, senha, tipo_usuario, created_at) VALUES (?, ?, ?, 'comum', NOW())";
      db.query(sql, [nome, email, senhaHash], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }
}

module.exports = UserModel;
