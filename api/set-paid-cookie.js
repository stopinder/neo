export default function handler(req, res) {
    const { redirect } = req.query
    res.setHeader('Set-Cookie', 'hasPaid=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400')
    res.writeHead(302, { Location: redirect || '/' })
    res.end()
}

