import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'College Testimonials Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  await params;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#eff6ff', // blue-50
          backgroundImage: 'radial-gradient(circle at 25px 25px, #bfdbfe 2%, transparent 0%), radial-gradient(circle at 75px 75px, #bfdbfe 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '60px 80px',
            borderRadius: '40px',
            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.1)',
            border: '2px solid #dbeafe', // blue-100
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: '#0f172a', // slate-900
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            College Testimonials
          </div>
          
          <div
            style={{
              fontSize: 40,
              color: '#2563eb', // blue-600
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Click to write a private memory for me!
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: 40, color: '#94a3b8', fontSize: 24, fontWeight: 600 }}>
          yearbooknostalgia.com
        </div>
      </div>
    ),
    { ...size }
  );
}
