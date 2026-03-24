export async function GET() {
    return Response.json({
        status: 'ok',
        service: 'Space Station Monitor',
        version: '1.0.0'
    });
}