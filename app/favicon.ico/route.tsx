// @ts-nocheck
import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const contentType = 'image/x-icon';

const size = {
  width: 32,
  height: 32,
} as const;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: 'black',
        }}
      >
        EP
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  );
}
