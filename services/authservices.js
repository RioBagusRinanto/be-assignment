
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ipyvbvybvrkjylrigipw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweXZidnlidnJranlscmlnaXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0MzE3MjQsImV4cCI6MjAzMTAwNzcyNH0.V5HgGHE8PyOJnvCidnhkauMsqKD-l7RyEJYh3IFdDik'
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;