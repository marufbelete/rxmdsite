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
        'products',
        'productCatagory',
        {
          type: Sequelize.DataTypes.ENUM("long term", "short term","other"),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'users',
        'twoFaSecret',
        {
          type: Sequelize.DataTypes.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'users',
        'mealPlan',
        {
          type: Sequelize.DataTypes.BOOLEAN,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'users',
        'exercisePlan',
        {
          type: Sequelize.DataTypes.BOOLEAN,
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
    
      await queryInterface.changeColumn('products', 'type', {
        type: Sequelize.ENUM('product', 'treatment','meal plan', 'fitness plan') 
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
      await queryInterface.removeColumn('users', 'twoFaSecret', { transaction });
      await queryInterface.removeColumn('users', 'affiliatedBy', { transaction });
      await queryInterface.removeColumn('users', 'exercisePlan', { transaction });
      await queryInterface.removeColumn('users', 'mealPlan', { transaction });
      await queryInterface.removeColumn('products', 'productCatagory', { transaction });
     await queryInterface.changeColumn('products', 'type', {
      type: Sequelize.ENUM('product', 'treatment'),
      defaultValue: 'product',
    }, { transaction });
      await transaction.commit();
    } 
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};



// await queryInterface.addColumn('products', 'temp_type', {
//   type: Sequelize.ENUM('product', 'treatment', 'meal plan', 'fitness plan'),
//   defaultValue: 'product',
//   after: 'type', // Add the column after the original 'type' column
// });
  
// // Step 3: Drop the original column
// await queryInterface.removeColumn('products', 'type', { transaction });

// // Step 4: Rename the temporary column
// await queryInterface.renameColumn('products', 'temp_type', 'type', {
//   transaction,
// });