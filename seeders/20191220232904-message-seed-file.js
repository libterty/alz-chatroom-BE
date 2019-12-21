'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Messages',
      [
        {
          message: 'Hello World',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: '??',
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: 'My name is not world',
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: 'That is rude',
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: 'LMAO',
          UserId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: 'Seriously you guys',
          UserId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: 'I mean it',
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: 'lol',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: 'hmmmmmmmmmmmmm',
          UserId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          message: `I'm out`,
          UserId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Messages', null, {});
  }
};
