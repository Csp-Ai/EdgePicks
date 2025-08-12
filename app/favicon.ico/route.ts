import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: 'white',
          color: 'black',
        }}
      >
        EP
      </div>
    ),
    {
      width: 32,
      height: 32,
    },
  );
}
