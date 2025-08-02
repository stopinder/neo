// pages/api/set-paid-cookie.js
export default function handler(req, res) {
    const { redirect } = req.query;

    // This sets a secure cookie that lasts 1 day
    res.setHeader('Set-Cookie', 'hasPaid=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400');

    // This redirects the user to the page you want (usually /full-report)
    res.writeHead(302, { Location: redirect || '/' });
    res.end();
}
