const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Remove PostgreSQL extension that's not supported in SQLite
    
    await queryInterface.createTable('companies', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      password_hash: DataTypes.STRING(255),
      oauth_provider: DataTypes.STRING(50),
      oauth_id: DataTypes.STRING(255),
      oauth_data: DataTypes.TEXT, // Changed from JSONB to TEXT for SQLite
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('chat_templates', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      prompt_template: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      context_data: DataTypes.TEXT, // Changed from JSONB to TEXT for SQLite
      settings: DataTypes.TEXT, // Changed from JSONB to TEXT for SQLite
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('conversations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      chat_template_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'chat_templates',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      end_user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      started_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      last_active_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      metadata: DataTypes.TEXT // Changed from JSONB to TEXT for SQLite
    });

    await queryInterface.createTable('chat_messages', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      conversation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      sender_type: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Create indexes
    await queryInterface.addIndex('users', ['company_id']);
    await queryInterface.addIndex('chat_templates', ['company_id']);
    await queryInterface.addIndex('conversations', ['chat_template_id']);
    await queryInterface.addIndex('conversations', ['end_user_id']);
    await queryInterface.addIndex('chat_messages', ['conversation_id']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['oauth_provider', 'oauth_id']);
    await queryInterface.addIndex('conversations', ['last_active_at']);
    await queryInterface.addIndex('chat_messages', ['timestamp']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('chat_messages');
    await queryInterface.dropTable('conversations');
    await queryInterface.dropTable('chat_templates');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('companies');
  }
};
