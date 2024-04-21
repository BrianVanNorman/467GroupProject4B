const connectLegacyDB = require('../legacyDB');

const searchCustomersByName = async (req, res) => {
  const searchTerm = req.query.name;
  try {
    const conn = await connectLegacyDB();
    const [rows] = await conn.execute(
      'SELECT name, city, street, contact FROM customers WHERE name LIKE ?',
      [`%${searchTerm}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).send('Error searching for customers');
  }
};
module.exports = { searchCustomersByName };