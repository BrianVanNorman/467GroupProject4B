const mysql = require('mysql2/promise');

const legacyDBConfig = {
  host: 'blitz.cs.niu.edu',
  port: 3306,
  user: 'student',
  password: 'student',
  database: 'csci467'
};

const connectLegacyDB = async () => {
  try {
    const connection = await mysql.createConnection(legacyDBConfig);
    console.log('Legacy Database (MariaDB) connected...');
    return connection;
  } catch (err) {
    console.error('Failed to connect to Legacy Database:', err.message);
    process.exit(1);
  }
};

module.exports = connectLegacyDB;