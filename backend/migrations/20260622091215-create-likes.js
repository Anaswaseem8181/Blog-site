'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Posts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Comments',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add Check Constraint: A like must belong to EITHER a post OR a comment, not both, not neither.
    await queryInterface.sequelize.query(`
      ALTER TABLE "Likes" 
      ADD CONSTRAINT "chk_likeable_type" 
      CHECK (
        ("postId" IS NOT NULL AND "commentId" IS NULL) OR 
        ("postId" IS NULL AND "commentId" IS NOT NULL)
      );
    `);

    // Add Unique Indexes to prevent a user from liking the same post or comment multiple times
    await queryInterface.addIndex('Likes', ['userId', 'postId'], {
      unique: true,
      name: 'unique_user_post_like',
      where: {
        postId: {
          [Sequelize.Op.ne]: null
        }
      }
    });

    await queryInterface.addIndex('Likes', ['userId', 'commentId'], {
      unique: true,
      name: 'unique_user_comment_like',
      where: {
        commentId: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Indexes and constraints are dropped automatically when the table is dropped
    await queryInterface.dropTable('Likes');
  }
};
