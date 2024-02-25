/* eslint-disable camelcase */
exports.up = async (pgm) => {
    await pgm.createTable('threads', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      title: {
        type: 'TEXT',
        notNull: true,
      },
      body: {
        type: 'TEXT',
        notNull: true,
      },
    });

    await pgm.addConstraint('threads', 'fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  };
  
  exports.down = async (pgm) => {
    await pgm.dropTable('threads');

    await pgm.dropConstraint('threads', 'fk_threads.owner_users.id');
  };
  