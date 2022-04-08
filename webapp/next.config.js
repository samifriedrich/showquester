module.exports = {
  pageExtensions: ['page.tsx', 'api.ts'],
  env: {
    FLASK_APP_URL: process.env.FLASK_APP_URL,
    MAPS_API_KEY: process.env.MAPS_API_KEY,
  },
}
