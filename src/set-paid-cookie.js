export default async function setPaidCookie() {
    try {
        await fetch('/api/set-cookie', {
            method: 'POST',
            credentials: 'include',
        })
    } catch (error) {
        console.error('Failed to set paid cookie:', error)
    }
}
