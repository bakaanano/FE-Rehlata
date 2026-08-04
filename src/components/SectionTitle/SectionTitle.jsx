export default function SectionTitle({ eyebrow, title, description, center = false }) {
  return (
    <div className={`section-title ${center ? 'section-title--center' : ''}`.trim()}>
      {eyebrow ? <span className="section-title__eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title__heading">{title}</h2>
      {description ? <p className="section-title__description">{description}</p> : null}
    </div>
  )
}