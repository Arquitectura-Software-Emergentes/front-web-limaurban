/**
 * API Route: Seed database con data dummy
 * POST /api/admin/seed
 * 
 * Inserta 100 incidentes dummy en la tabla incidents
 * SOLO PARA DESARROLLO - Proteger en producción
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dummyIncidents } from '@/data/dummyIncidents';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Verificar autenticación (opcional en dev, obligatorio en prod)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Mapear datos dummy al schema de Supabase
    const incidentsToInsert = dummyIncidents.map((incident) => ({
      title: incident.title,
      description: incident.description,
      category_code: incident.category_code,
      status: incident.status,
      priority: incident.priority,
      location_lat: incident.latitude,
      location_lng: incident.longitude,
      district_code: incident.district_code,
      address: incident.address_line,
      reported_by: user.id, // Usa el ID del usuario autenticado
      image_url: null,
      created_at: incident.created_at,
      updated_at: incident.created_at,
    }));

    // Insertar en batch
    const { data, error } = await supabase
      .from('incidents')
      .insert(incidentsToInsert)
      .select('id, title, district_code, status');

    if (error) {
      console.error('Error inserting incidents:', error);
      return NextResponse.json(
        { 
          error: 'Database error', 
          details: error.message,
          hint: error.hint,
          code: error.code 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded database',
      inserted: data?.length || 0,
      preview: data?.slice(0, 5), // Mostrar primeros 5
    });

  } catch (error) {
    console.error('Seed endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

// GET para verificar cuántos incidentes hay
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('incidents')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      current_incidents_count: count,
      dummy_incidents_available: dummyIncidents.length,
      ready_to_seed: count === 0,
    });

  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
