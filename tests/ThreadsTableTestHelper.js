/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async createThread({
    id = 'thread-123', title = 'Example Title', body = 'Example Body', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, owner, title, body],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;