exports.up = (pgm) => {
    pgm.addColumns('threads', {
        date: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumns('threads', 'date');
};