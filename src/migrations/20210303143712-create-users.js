'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      user_id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      fullname: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING
      },
      profile_picture: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING
      },
      role_id: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};