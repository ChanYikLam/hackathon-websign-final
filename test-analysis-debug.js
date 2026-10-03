const fs = require('fs');
const { query } = require('./src/config/database');
const { analyzeEntrepreneurProfile } = require('./src/utils/aiService');
const { generateMockResult } = require('./src/utils/mockAnalysis');

const log = (msg) => {
  const line = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
  console.log(line);
  fs.appendFileSync('debug-output.log', line + '\n');
};

(async () => {
  fs.writeFileSync('debug-output.log', '=== Analysis Debug Log (Post-Fix) ===\n');
  
  try {
    const userId = 2;

    const [users] = await query("SELECT is_info_completed, is_mbti_completed FROM users WHERE id = ?", [userId]);
    log('User status: ' + JSON.stringify(users[0]));

    // Fixed query: now includes schedule AS work_schedule
    const [profileRows] = await query(
      "SELECT up.city, up.skill, up.mbti_type, up.intensity, up.schedule AS work_schedule FROM user_profiles up WHERE up.user_id = ?",
      [userId]
    );
    const profile = profileRows.length > 0 ? profileRows[0] : {};
    log('Profile from DB (fixed): ' + JSON.stringify(profile));
    log('work_schedule field: ' + profile.work_schedule);

    // Call AI with new 120s timeout
    log('\n--- Calling AI (timeout now 120s) ---');
    const startTime = Date.now();
    try {
      const result = await analyzeEntrepreneurProfile(profile);
      log('AI SUCCESS in ' + (Date.now() - startTime) + 'ms');
      log('Profile tags: ' + JSON.stringify(result.profile?.tags));
      log('Directions: ' + result.directions?.map(d => d.name).join(', '));
      log('User type: ' + result.user_type + ' / ' + result.user_type_label);
    } catch (aiError) {
      log('AI FAILED in ' + (Date.now() - startTime) + 'ms');
      log('Error: ' + aiError.message);
    }

  } catch (e) {
    log('Unexpected error: ' + e.message);
  }

  process.exit(0);
})();
