const db = require('../db/connection');

class EventoController {
  static listarEventos(req, res) {
    const sql = `
      SELECT id, titulo, descricao_curta, imagem_url 
      FROM eventos 
      WHERE deleted_at IS NULL 
      ORDER BY created_at DESC
    `;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Erro ao buscar eventos:", err);
        return res.status(500).json({ error: "Erro ao buscar eventos" });
      }
      res.json(result);
    });
  }
}

module.exports = EventoController;
