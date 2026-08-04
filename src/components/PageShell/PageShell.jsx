export default function PageShell({ eyebrow, title, description, children }) {
  return (
    <main className="page-shell">
      <div className="container page-shell__hero">
        <div className="section-title">
          {eyebrow ? <span className="section-title__eyebrow">{eyebrow}</span> : null}
          <h1 className="section-title__heading">{title}</h1>
          {description ? <p className="section-title__description">{description}</p> : null}
        </div>
      </div>
      <div className="container">
        <div className="card page-shell__panel">{children}</div>
      </div>
    </main>
  )
}