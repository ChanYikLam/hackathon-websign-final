const mysql = require("mysql2/promise");

(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Coder0904@",
    database: "solopilot_db",
  });

  try {
    // Disable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    // Truncate all user data tables
    const tables = [
      "ai_logs",
      "ai_chat_records",
      "user_reviews",
      "ai_team_answers",
      "user_feedback",
      "analysis_results",
      "analysis_tasks",
      "info_collect_answers",
      "user_profiles",
      "users",
    ];

    for (const table of tables) {
      await connection.execute(`TRUNCATE TABLE \`${table}\``);
      console.log(`✅ Cleared table: ${table}`);
    }

    // Re-enable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

    // Verify counts
    console.log("\n📊 Verification - Row counts:");
    for (const table of [...tables, "sys_config"]) {
      const [rows] = await connection.execute(
        `SELECT COUNT(*) as count FROM \`${table}\``,
      );
      console.log(`  ${table}: ${rows[0].count} rows`);
    }

    console.log("\n✅ All user data has been cleared successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await connection.end();
  }
})();
