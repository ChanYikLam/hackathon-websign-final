const axios = require('axios');

(async () => {
  try {
    // 1. Register or Login
    let token;
    try {
      const regRes = await axios.post('http://localhost:3000/api/v1/auth/register', {
        username: 'analysistest' + Date.now(),
        password: 'password123'
      });
      token = regRes.data.data.token;
      console.log('Registered OK');
    } catch (e) {
      console.log('Register failed, trying login:', e.response?.data?.message);
      const loginRes = await axios.post('http://localhost:3000/api/v1/auth/login', {
        username: 'analysistest',
        password: 'password123'
      });
      token = loginRes.data.data.token;
      console.log('Login OK');
    }

    // 1b. Complete info collection
    console.log('Setting up user info...');
    await axios.put('/user/info', {
      city: '一线城市',
      intensity: '965',
      skill: '编程',
      direction: 'SaaS产品',
      purpose: '实现财务自由',
      schedule: '工作日晚上和周末'
    }, { headers: { Authorization: 'Bearer ' + token }, baseURL: 'http://localhost:3000/api/v1' });
    
    // 1c. Skip MBTI
    await axios.post('http://localhost:3000/api/v1/mbti/skip', {
      mbti_type: 'INTJ'
    }, { headers: { Authorization: 'Bearer ' + token } });
    console.log('User setup complete');

    // 2. Trigger analysis
    const triggerRes = await axios.post('http://localhost:3000/api/v1/analysis/trigger', {}, {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Trigger result:', JSON.stringify(triggerRes.data));

    const taskId = triggerRes.data.data.taskId;

    // 3. Poll status
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const statusRes = await axios.get('http://localhost:3000/api/v1/analysis/status/' + taskId, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const status = statusRes.data.data;
      console.log('Status:', status.status, 'progress:', status.progress);
      if (status.status === 'completed' || status.status === 'failed') {
        if (status.status === 'failed') {
          console.log('FAILED! Checking error...');
          // Query task detail for error
          const [tasks] = await require('./src/config/database').query(
            'SELECT error_detail FROM analysis_tasks WHERE task_id = ?',
            [taskId]
          );
          console.log('Error detail:', tasks[0]?.error_detail);
        }
        break;
      }
    }

    // 4. Get result
    const resultRes = await axios.get('http://localhost:3000/api/v1/analysis/result', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const data = resultRes.data.data;
    console.log('\n=== Result Analysis ===');
    console.log('Profile tags:', JSON.stringify(data.profile_tags));
    console.log('Profile desc:', data.profile_desc ? data.profile_desc.substring(0, 80) + '...' : 'EMPTY');
    console.log('Directions type:', typeof data.directions);
    if (Array.isArray(data.directions)) {
      console.log('Directions count:', data.directions.length);
      if (data.directions.length > 0) {
        console.log('First direction keys:', Object.keys(data.directions[0]));
      }
    } else {
      console.log('Directions value (first 200 chars):', String(data.directions).substring(0, 200));
    }
    console.log('User type:', data.user_type);
    console.log('Summary profile:', data.summary_profile ? data.summary_profile.substring(0, 80) + '...' : 'EMPTY');
    console.log('Checklist type:', typeof data.summary_checklist);
    console.log('Checklist:', JSON.stringify(data.summary_checklist));
  } catch (e) {
    console.log('ERROR:', e.response?.status, JSON.stringify(e.response?.data) || e.message);
  }

  process.exit(0);
})();
