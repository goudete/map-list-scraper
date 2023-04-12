const { createClient } = require('@supabase/supabase-js');
const { consts } = require('../consts');

const supabase = createClient(
  consts.SUPABASE_PROJECT_URL,
  consts.SUPABASE_API_KEY
);

module.exports = supabase;