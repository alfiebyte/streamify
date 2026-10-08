# Streamify

[![Live Demo](https://img.shields.io/badge/Vercel-live%20demo-255dd7?style=for-the-badge&logo=vercel)](https://streamify-teal-tau.vercel.app/)

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![TMDB](https://img.shields.io/badge/TMDB_API-01B4E4?logo=themoviedatabase&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth_2.0-4285F4?logo=google&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

A web app for discovering movies and TV series and tracking what you've watched, including episode progress for series and total runtime for films.

**[Try the live demo](https://streamify-teal-tau.vercel.app/)**

![Preview](docs/preview.png)

## Features

- **Discover:** browse movies and series, and find where to watch them
- **Track progress:** mark individual episodes as watched and log movie runtimes
- **Secure sign-in:** Google OAuth 2.0 authentication, so your watch history is private, saved and synced across devices
- **Automated CI/CD:** GitHub Actions runs the tests and deploys to Vercel automatically on every push or pull request

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite |
| API | TMDB API |
| Deployment | Vercel |
| Backend | Vercel serverless functions |
| Database | Supabase (PostgreSQL) |
| Authentication | Google OAuth 2.0 |
| DevOps | GitHub Actions CI/CD, Vercel |
| Testing | Vitest |

## Install

Install the project dependencies and the Vercel CLI:

```bash
npm install
npm install -g vercel
```

Create a TMDB API access token and a Supabase project, then add these values to your `.env` file:

```
TMDB_ACCESS_TOKEN=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Testing

Run the test command to check that the application is working properly:

```bash
npm run test
```

Tests also run automatically in CI before every deployment.

## Deployment

```bash
npm install -g vercel
vercel deploy
```

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB.

Built by [@alfiebyte](https://github.com/alfiebyte).