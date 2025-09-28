import { createClient } from '@supabase/supabase-js';

// --- INSTRUCCIONES ---
// 1. Ve a tu proyecto de Supabase en https://app.supabase.com/
// 2. Ve a la configuración del proyecto (ícono de engranaje).
// 3. Haz clic en "API" en el menú lateral.
// 4. Copia la "URL del Proyecto" y pégala en `supabaseUrl`.
// 5. Copia la clave "anon" "public" y pégala en `supabaseAnonKey`.

const supabaseUrl = 'https://ejayjdheycqqztlibsvl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqYXlqZGhleWNxcXp0bGlic3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwOTU3MDAsImV4cCI6MjA3NDY3MTcwMH0.fqV-g41_9wo_v9bEHFfakfAryBQzzE-jOcGrsD1SotY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);