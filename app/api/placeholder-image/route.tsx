import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name') || 'Token'
        const symbol = searchParams.get('symbol') || 'TKN'
        const style = searchParams.get('style') || 'logo'

        const isLogo = style === 'logo'
        const width = isLogo ? 512 : 1200
        const height = isLogo ? 512 : 630

        return new ImageResponse(
            (
                <div style= {{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui, sans-serif',
        }}>
            <div style={ { display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
            {
                isLogo?(
              <>
                <div style={
                    {
                        fontSize: 120,
                            fontWeight: 'bold',
                                color: 'white',
                                    marginBottom: 20,
                }
    }>
        { symbol.substring(0, 3) }
        </div>
        < div style = {{
        fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
                }
}>
    { name }
    </div>
    </>
            ) : (
    <>
    <div style= {{
    fontSize: 72,
        fontWeight: 'bold',
            color: 'white',
                marginBottom: 20,
                    textAlign: 'center',
                }}>
    { name }
    </div>
    < div style = {{
    fontSize: 48,
        color: 'rgba(255,255,255,0.9)',
            backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '10px 30px',
                    borderRadius: 50,
                }}>
    ${ symbol }
</div>
    </>
            )}
</div>
    </div>
      ),
{
    width,
        height,
      }
    )
  } catch (error) {
    console.error('Placeholder generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
}
}
