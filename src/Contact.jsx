import { useRef, useState } from 'react';
import { ContactMarkup } from './content.jsx';
import { useLanguage } from './language.jsx';

export default function Contact() {
  const { tr } = useLanguage();
  const busy = useRef(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    for (const field of ['name', 'message', 'email']) form.elements[field].value = form.elements[field].value.trim();
    if (form.elements._honey.value || !form.reportValidity()) return;
    busy.current = true;
    setSending(true);
    setStatus(tr('Enviando sua mensagem…', 'Sending your message…'));
    try {
      const response = await fetch('https://formsubmit.co/ajax/enzofalcantara@gmail.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === 'true') || /activat|ativar|verify|verifi/i.test(result.message || '')) throw Error('unavailable');
      form.reset();
      setStatus(tr('Mensagem aceita para envio! Obrigado pelo contato.', 'Message accepted for sending! Thank you for getting in touch.'));
    } catch {
      setStatus(tr('Não foi possível confirmar o envio. Sua mensagem continua aqui. Tente novamente ou envie diretamente para enzofalcantara@gmail.com.', 'We could not confirm sending. Your message is still here. Try again or email enzofalcantara@gmail.com directly.'));
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  return <ContactMarkup onSubmit={submit} sending={sending} status={status} />;
}
