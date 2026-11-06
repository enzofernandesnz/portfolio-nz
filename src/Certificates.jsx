import { useEffect, useRef, useState } from 'react';
import { useLanguage, Text } from './language.jsx';

const certificates = [
  { date: '2025-11-17', pt: 'Introdução à IA moderna', en: 'Introduction to Modern AI', file: 'ia-2025.webp' },
  { date: '2025-11-17', pt: 'Introdução à IoT e à Transformação Digital', en: 'Introduction to IoT and Digital Transformation', file: 'iot-2025.webp' },
  { date: '2025-11-17', pt: 'Fundamentos do Hardware do Computador', en: 'Computer Hardware Basics', file: 'hardware-2025.webp' },
  { date: '2025-11-17', pt: 'Uso de Computadores e Dispositivos Móveis', en: 'Using Computer and Mobile Devices', file: 'dispositivos-2025.webp' },
  { date: '2025-11-11', pt: 'Introdução à Cibersegurança', en: 'Introduction to Cybersecurity', file: 'ciberseguranca-2025.webp' },
  { date: '2025-11-11', pt: 'Conscientização digital', en: 'Digital Awareness', file: 'consciencia-digital-2025.webp' },
  { date: '2025-04-03', pt: 'Defesa de rede', en: 'Network Defense', file: 'defesa-rede-2025.webp' },
  { date: '2024-11-16', pt: 'Introdução à Cibersegurança', en: 'Introduction to Cybersecurity', file: 'ciberseguranca-2024.webp' },
  { date: '2024-06-28', pt: 'Fundamentos do Hardware do Computador', en: 'Computer Hardware Basics', file: 'hardware-2024.webp' },
];

const imagePath = certificate => `assets/certificates/${certificate.file}`;

function cardStep(track) {
  const card = track?.firstElementChild;
  if (!card) return 1;
  return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 0);
}

export default function Certificates() {
  const { tr, locale } = useLanguage();
  const [index, setIndex] = useState(0);
  const [dialogIndex, setDialogIndex] = useState(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const indexRef = useRef(0);
  const dialogRef = useRef(null);

  const certificateDate = certificate => new Date(`${certificate.date}T12:00:00`).toLocaleDateString(locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const certificateAlt = certificate => tr(
    `Certificado de ${certificate.pt}, de Enzo Fernandes Alcantara.`,
    `Certificate for ${certificate.en}, awarded to Enzo Fernandes Alcantara.`,
  );

  function moveTo(nextIndex) {
    const track = trackRef.current;
    if (!track) return;
    const boundedIndex = Math.max(0, Math.min(certificates.length - 1, nextIndex));
    track.scrollTo({
      left: boundedIndex * cardStep(track),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    function updateIndex() {
      const nextIndex = Math.max(0, Math.min(certificates.length - 1, Math.round(track.scrollLeft / cardStep(track))));
      indexRef.current = nextIndex;
      setIndex(nextIndex);
    }

    function resize() {
      track.scrollTo({ left: indexRef.current * cardStep(track), behavior: 'instant' });
      updateIndex();
    }

    track.addEventListener('scroll', updateIndex, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    updateIndex();
    return () => {
      track.removeEventListener('scroll', updateIndex);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    cardRefs.current.forEach((card, cardIndex) => {
      if (card) card.inert = cardIndex !== index;
    });
  }, [index]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialogIndex !== null && dialog && !dialog.open) dialog.showModal();
  }, [dialogIndex]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function closeOnBackdrop(event) {
    const dialog = dialogRef.current;
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog();
  }

  const openedCertificate = dialogIndex === null ? null : certificates[dialogIndex];

  return (
    <>
      <section className="certificates-section" id="certificados" aria-labelledby="certificates-title">
        <div className="wrap section">
          <div className="section-label"><span>03 /</span><Text as="span" pt="CERTIFICADOS" en="CERTIFICATES" /></div>
          <div className="certificate-heading">
            <div>
              <Text as="h2" id="certificates-title" pt="Aprendizado que faz parte da jornada." en="Learning that shapes the journey." />
              <Text as="p" pt="Cursos que ampliam minha formação e minha experiência com tecnologia." en="Courses that expand my education and experience with technology." />
            </div>
            <span className="certificate-count" aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(certificates.length).padStart(2, '0')}</span>
          </div>
          <div className="certificate-carousel">
            <button type="button" className="certificate-prev" aria-controls="certificate-slide" aria-label={tr('Certificado anterior', 'Previous certificate')} disabled={index === 0} onClick={() => moveTo(index - 1)}><span aria-hidden="true">‹</span></button>
            <div className="certificate-track" id="certificate-slide" role="region" aria-labelledby="certificates-title" tabIndex={0} ref={trackRef}>
              {certificates.map((certificate, certificateIndex) => (
                <article className={`certificate-card${index === certificateIndex ? ' is-current' : ''}`} key={certificate.file} ref={card => { cardRefs.current[certificateIndex] = card; }}>
                  <button className="certificate-preview" type="button" aria-label={tr(`Ampliar certificado de ${certificate.pt}`, `Enlarge ${certificate.en} certificate`)} onClick={() => setDialogIndex(certificateIndex)}>
                    <img src={imagePath(certificate)} alt={certificateAlt(certificate)} width="1395" height="945" loading="lazy" />
                    <span aria-hidden="true">↗</span>
                  </button>
                  <div className="certificate-info">
                    <Text as="span" className="certificate-tag" pt="CERTIFICADO DE CONCLUSÃO" en="CERTIFICATE OF COMPLETION" />
                    <h3>{tr(certificate.pt, certificate.en)}</h3>
                    <p className="certificate-issuer">Cisco Networking Academy · COTEMIG</p>
                    <Text as="p" className="certificate-copy" pt="Curso oferecido pela COTEMIG — Colégio e Faculdade, por meio da Cisco Networking Academy." en="Course offered by COTEMIG — Colégio e Faculdade through Cisco Networking Academy." />
                    <p className="certificate-date">{tr(`Concluído em ${certificateDate(certificate)}`, `Completed on ${certificateDate(certificate)}`)}</p>
                    <Text as="button" className="certificate-open" type="button" pt="Ver certificado ↗" en="View certificate ↗" onClick={() => setDialogIndex(certificateIndex)} />
                  </div>
                </article>
              ))}
            </div>
            <button type="button" className="certificate-next" aria-controls="certificate-slide" aria-label={tr('Próximo certificado', 'Next certificate')} disabled={index === certificates.length - 1} onClick={() => moveTo(index + 1)}><span aria-hidden="true">›</span></button>
          </div>
          <div className="certificate-pagination" role="group" aria-label={tr('Selecionar certificado', 'Select certificate')}>
            {certificates.map((certificate, certificateIndex) => <button type="button" key={certificate.file} aria-controls="certificate-slide" aria-label={`${tr('Ver certificado', 'View certificate')}: ${tr(certificate.pt, certificate.en)} (${certificateDate(certificate)})`} aria-current={certificateIndex === index ? 'true' : undefined} onClick={() => moveTo(certificateIndex)} />)}
          </div>
        </div>
      </section>
      <dialog id="certificate-dialog" aria-labelledby="certificate-dialog-title" ref={dialogRef} onClose={() => setDialogIndex(null)} onClick={closeOnBackdrop}>
        <button type="button" className="certificate-close" aria-label={tr('Fechar', 'Close')} onClick={closeDialog}>×</button>
        <h3 id="certificate-dialog-title">{openedCertificate && tr(openedCertificate.pt, openedCertificate.en)}</h3>
        <img className="certificate-full" src={openedCertificate ? imagePath(openedCertificate) : undefined} alt={openedCertificate ? certificateAlt(openedCertificate) : ''} />
        <p className="certificate-dialog-date">{openedCertificate && tr(`Concluído em ${certificateDate(openedCertificate)}`, `Completed on ${certificateDate(openedCertificate)}`)}</p>
      </dialog>
    </>
  );
}
