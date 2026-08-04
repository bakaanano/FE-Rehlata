import { useState } from 'react'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import Button from '../Button/Button'

const quickReplies = [
  'Info paket umrah',
  'Jadwal keberangkatan',
  'Konsultasi biaya',
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="chatbot">
      {isOpen ? (
        <div className="chatbot__panel" role="dialog" aria-modal="true" aria-label="Chatbot Rehlata Tour">
          <div className="chatbot__header">
            <div>
              <span className="chatbot__eyebrow">Rehlata Assistant</span>
              <h3 className="chatbot__title">Butuh bantuan cepat?</h3>
            </div>
            <button
              type="button"
              className="chatbot__close"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chatbot"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="chatbot__body">
            <div className="chatbot__message chatbot__message--bot">
              Halo, saya bisa bantu info paket, jadwal, dan konsultasi umrah.
            </div>
            <div className="chatbot__message chatbot__message--user">
              Klik salah satu tombol cepat di bawah untuk mulai.
            </div>
          </div>

          <div className="chatbot__quick-replies">
            {quickReplies.map((reply) => (
              <button key={reply} type="button" className="chatbot__chip">
                {reply}
              </button>
            ))}
          </div>

          <div className="chatbot__footer">
            <Button type="button" variant="primary" className="chatbot__action">
              Mulai Chat
            </Button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="chatbot__launcher"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Tutup chatbot' : 'Buka chatbot'}
        aria-expanded={isOpen}
      >
        <FiMessageCircle size={20} />
        <span>Chatbot</span>
      </button>
    </div>
  )
}