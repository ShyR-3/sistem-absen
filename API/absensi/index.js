import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Handler untuk request
export default async function handler(req, res) {
  // CORS - Agar bisa diakses dari frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST - Simpan absen baru
  if (req.method === 'POST') {
    try {
      const { nama, status, tanggal } = req.body;

      // Validasi
      if (!nama || !status || !tanggal) {
        return res.status(400).json({ 
          status: 'gagal', 
          error: 'Data tidak lengkap' 
        });
      }

      // Insert ke database
      const { data, error } = await supabase
        .from('mahasiswa')
        .insert([{ 
          nama_mahas: nama, 
          status: status, 
          tanggal: tanggal 
        }]);

      if (error) {
        return res.status(500).json({ 
          status: 'gagal', 
          error: error.message 
        });
      }

      return res.status(200).json({ 
        status: 'sukses', 
        message: 'Absen berhasil disimpan',
        data: data 
      });

    } catch (err) {
      return res.status(500).json({ 
        status: 'gagal', 
        error: err.message 
      });
    }
  }

  // GET - Ambil semua data absen
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('mahasiswa')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        return res.status(500).json({ 
          status: 'gagal', 
          error: error.message 
        });
      }

      return res.status(200).json({ 
        status: 'sukses', 
        data: data 
      });

    } catch (err) {
      return res.status(500).json({ 
        status: 'gagal', 
        error: err.message 
      });
    }
  }

  // Method tidak didukung
  return res.status(405).json({ 
    status: 'gagal', 
    error: 'Method tidak didukung' 
  });
}