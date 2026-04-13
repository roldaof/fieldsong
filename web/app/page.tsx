export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="logo">fieldsong</div>
        <h1>A daily clarity ritual</h1>
        <p className="subtitle">
          One Bhagavad Gita verse. One Stoic reflection. A moment of stillness
          to start your day with ancient wisdom.
        </p>
        <a
          href="https://play.google.com/store/apps/details?id=app.fieldsong"
          className="cta-button"
        >
          Download for Android
        </a>
      </section>

      <section className="section">
        <div className="how-it-works">
          <div className="section-title">How it works</div>
          <div className="step">
            <span className="step-number">1</span>
            <div>
              <h3>Choose your intention</h3>
              <p>
                Clarity, courage, patience, acceptance, discipline, or
                perspective. Your choice shapes the verses you receive.
              </p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <div>
              <h3>Receive your daily verse</h3>
              <p>
                Each morning, a Bhagavad Gita verse paired with a Stoic
                parallel — two traditions, one insight.
              </p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <div>
              <h3>Reflect and practice</h3>
              <p>
                A concrete action step and reflection prompt turn ancient
                wisdom into something you can use today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="quote-block">
          <blockquote>
            &ldquo;The mind acts like an enemy for those who do not control
            it.&rdquo;
          </blockquote>
          <cite>Bhagavad Gita 6.6</cite>
        </div>
      </section>

      <section className="section">
        <div className="features-wrap">
          <div className="section-title">What you get</div>
          <div className="features">
            <div className="feature-card">
              <h3>Daily ritual</h3>
              <p>
                A curated Gita verse, modern interpretation, Stoic parallel,
                and reflection prompt delivered every morning.
              </p>
            </div>
            <div className="feature-card">
              <h3>Cross-tradition wisdom</h3>
              <p>
                East meets West. Each verse is paired with a quote from Marcus
                Aurelius, Seneca, or Epictetus.
              </p>
            </div>
            <div className="feature-card">
              <h3>Journal</h3>
              <p>
                Save your reflections and revisit them. Track your practice
                over time.
              </p>
            </div>
            <div className="feature-card">
              <h3>Email delivery</h3>
              <p>
                Your verse arrives by email too. Reply to save a journal
                entry, no app needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="quote-block">
          <blockquote>
            &ldquo;You have power over your mind — not outside events. Realize
            this, and you will find strength.&rdquo;
          </blockquote>
          <cite>Marcus Aurelius, Meditations</cite>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="mailto:hello@fieldsong.app">Contact</a>
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} FieldSong. All rights reserved.
        </p>
      </footer>
    </>
  );
}
