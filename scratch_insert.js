const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qgaabxifnyrckkpzqcjk.supabase.co';
const supabaseKey = 'sb_publishable_8QAFbTDemSIbEvuLBQjQ5A_oSA44Bir';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixImagePaths() {
  await supabase.from('reports').update({ photo_url: '/images/reports/repair.jpg' }).eq('id', 'REP-4282');
  await supabase.from('reports').update({ photo_url: '/images/reports/repair.jpg' }).eq('id', 'REP-3001');
  await supabase.from('reports').update({ photo_url: '/images/reports/trash.jpg' }).eq('id', 'REP-3002');
  await supabase.from('reports').update({ photo_url: '/images/reports/streetlight.jpg' }).eq('id', 'REP-3003');

  console.log('Successfully updated old report images to prevent visual duplication.');
}

fixImagePaths();

