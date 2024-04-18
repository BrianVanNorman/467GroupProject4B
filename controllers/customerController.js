const connectLegacyDB = require('../legacyDB');

exports.fetchCustomerData = async (customerId) => {
  const connection = await connectLegacyDB();
  try {
    const [customers] = await connection.query('SELECT id, Name AS customer_name, Contact AS customer_email FROM customers WHERE id = ?', [customerId]);
    return customers;
  } catch (error) {
    console.error('Error fetching customer data:', error.message);
  } finally {
    await connection.end();
  }
};