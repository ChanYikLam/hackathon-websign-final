const mysql = require("mysql2/promise");
const config = require("./index");

let pool;

async function createPool() {
  if (!pool) {
    pool = mysql.createPool(config.db);
    const connection = await pool.getConnection();
    console.log("✓ Database connection pool created successfully");
    connection.release();
  }
  return pool;
}

async function getPool() {
  if (!pool) {
    return await createPool();
  }
  return pool;
}

async function query(sql, params) {
  const pool = await getPool();
  return pool.query(sql, params);
}

async function transaction(callback) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("✓ Database connection pool closed");
  }
}

module.exports = {
  createPool,
  getPool,
  query,
  transaction,
  closePool,
};
