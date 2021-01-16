
exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
      table.increments('id')
      table.text('email').unique().notNullable()
      table.text('name').notNullable()
      table.text('password').notNullable()
      table.text('photo')
      table.text('passwordResetToken')
      table.text('passwordResetExpires')

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now()) 
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
