<template>
  <main class="not-found-page">
    <div class="not-found-page__card">
      <p class="not-found-page__eyebrow">404</p>
      <h1>Page not found</h1>
      <p>
        The page you requested does not exist. Check the URL or return to the main site.
      </p>
      <a href="/" class="not-found-page__button">Back to Home</a>
    </div>
  </main>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.08), transparent 24%),
    radial-gradient(circle at top right, rgba(180, 83, 9, 0.08), transparent 22%),
    linear-gradient(180deg, #fcfaf5 0%, #f6f2ea 100%);
  font-family: "Instrument Sans", "Segoe UI", sans-serif;
  color: #1f2937;
}

.not-found-page__card {
  width: min(520px, 100%);
  padding: 2rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(31, 41, 55, 0.1);
  box-shadow: 0 24px 60px rgba(33, 40, 52, 0.1);
}

.not-found-page__eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.76rem;
  font-weight: 800;
  color: #0f766e;
}

.not-found-page h1 {
  margin: 0.75rem 0 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.not-found-page p {
  margin: 1rem 0 0;
  color: #5d6a79;
  line-height: 1.8;
}

.not-found-page__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  min-height: 2.7rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 118, 110, 0.16);
  background: rgba(15, 118, 110, 0.08);
  color: #115e59;
  text-decoration: none;
  font-weight: 700;
}

.not-found-page__button:hover {
  background: rgba(15, 118, 110, 0.12);
}
</style>
