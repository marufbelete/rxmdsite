module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'users',
        'affiliateLink',
        {
          type: Sequelize.DataTypes.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'users',
        'affiliatedBy',
        {
          type: Sequelize.DataTypes.INTEGER,
        },
        { transaction }
      );
      await queryInterface.addConstraint('users', {
        type: 'foreign key',
        fields: ['affiliatedBy'],
        name: 'user_user_id_fk',
        references: {
          table: 'users',
          field: 'id'
        }
      },{transaction});
      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint('users', 'user_user_id_fk', { transaction });
      await queryInterface.removeColumn('users', 'affiliateLink', { transaction });
      await queryInterface.removeColumn('users', 'affiliatedBy', { transaction });

      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

