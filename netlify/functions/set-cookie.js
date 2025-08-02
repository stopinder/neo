[build]
command = "npm run build"
publish = "dist"

    [[redirects]]
from = "/api/*"
to = "/.netlify/functions/:splat"
status = 200

    [[redirects]]
from = "/payment-success"
to = "/set-paid-cookie"
status = 200
