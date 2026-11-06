import { Text, useLanguage } from './language.jsx';

export function HeaderMarkup({menuOpen, active, closeMenu, toggleMenu}) {
  const {language, tr, setLanguage} = useLanguage();
  return (
    <header className="header">
      <div className="wrap nav-wrap">
        {"\n  "}
        <a className="brand-name" href="#inicio" aria-label="Enzo Fernandes, início">
          {"nz"}
          <span>
            {"ENZO FERNANDES"}
          </span>
        </a>
        {"\n  "}
        <nav id="navigation" className={menuOpen ? 'open' : undefined} aria-label={tr('Navegação principal','Main navigation')}>
          {"\n    "}
          <Text as="a" pt="Sobre mim" en="About" href="#sobre" onClick={closeMenu} className={active === "sobre" ? 'active' : undefined} />
          <Text as="a" pt="Projetos" en="Projects" href="#projetos" onClick={closeMenu} className={active === "projetos" ? 'active' : undefined} />
          <Text as="a" pt="Certificados" en="Certificates" href="#certificados" onClick={closeMenu} className={active === "certificados" ? 'active' : undefined} />
          <Text as="a" pt="GitHub" en="GitHub" href="#github" onClick={closeMenu} className={active === "github" ? 'active' : undefined} />
          <Text as="a" pt="Experiências" en="Experience" href="#experiencias" onClick={closeMenu} className={active === "experiencias" ? 'active' : undefined} />
          <Text as="a" pt="Contato" en="Contact" href="#contato" onClick={closeMenu} className={active === "contato" ? 'active' : undefined} />
          {"\n  "}
        </nav>
        {"\n  "}
        <div className="nav-actions">
          <div className="languages" aria-label="Idioma / Language">
            <button type="button" data-language="pt" onClick={() => setLanguage("pt")} aria-pressed={language === "pt"}>
              {"PT"}
            </button>
            <span>
              {"/"}
            </span>
            <button type="button" data-language="en" onClick={() => setLanguage("en")} aria-pressed={language === "en"}>
              {"EN"}
            </button>
          </div>
          <button type="button" className="menu-toggle" aria-controls="navigation" onClick={toggleMenu} aria-expanded={menuOpen} aria-label={tr('Alternar menu','Toggle menu')}>
            <span />
            <span />
          </button>
        </div>
        {"\n"}
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero wrap" id="inicio" aria-labelledby="hero-title">
      {"\n  "}
      <div className="hero-top">
        <span className="eyebrow">
          <i className="status-dot" />
          <Text as="span" pt="EM CONSTANTE EVOLUÇÃO" en="ALWAYS LEARNING" />
        </span>
        <span className="location">
          {"BELO HORIZONTE, BR "}
          <span aria-hidden="true">
            {"↗"}
          </span>
        </span>
      </div>
      {"\n  "}
      <div className="hero-grid">
        <div className="hero-copy">
          <Text as="p" pt="Olá, eu sou o Enzo." en="Hi, I'm Enzo." className="intro" />
          {"\n    "}
          <h1 id="hero-title">
            <Text as="span" pt="Curiosidade em" en="Curiosity into" />
            <br />
            <Text as="span" pt="código." en="code." className="serif" />
            <br />
            <Text as="span" pt="Ideias em" en="Ideas into" />
            {" "}
            <Text as="em" pt="prática." en="action." />
          </h1>
          {"\n    "}
          <Text as="p" pt="Estudante de Engenharia de Software, apaixonado por aprender e transformar ideias em soluções. Exploro desenvolvimento, dados e inteligência artificial para criar projetos com propósito e enfrentar desafios do dia a dia." en="A Software Engineering student driven by learning and turning ideas into solutions. I explore development, data and artificial intelligence to build purposeful projects and address everyday challenges." className="hero-description" />
          {"\n    "}
          <div className="hero-buttons">
            <a className="button primary" href="#projetos">
              <Text as="span" pt="Explorar projetos" en="Explore projects" />
              <span aria-hidden="true">
                {"↗"}
              </span>
            </a>
            <a className="text-link" href="#contato">
              <Text as="span" pt="Vamos conversar" en="Let's talk" />
              <span aria-hidden="true">
                {"→"}
              </span>
            </a>
          </div>
          {"\n  "}
        </div>
        {"\n  \n  "}
      </div>
      {"\n  "}
      <div className="hero-bottom">
        <Text as="span" pt="APRENDER. CONSTRUIR. EVOLUIR." en="LEARN. BUILD. EVOLVE." />
        <Text as="a" pt="Conheça minha trajetória ↓" en="Explore my journey ↓" href="#sobre" />
      </div>
      {"\n"}
    </section>
  );
}

export function About() {
  return (
    <section className="section about wrap" id="sobre" aria-labelledby="about-title">
      <div className="section-label">
        <span>
          {"01 /"}
        </span>
        <Text as="span" pt="SOBRE MIM" en="ABOUT ME" />
      </div>
      {"\n  "}
      <div className="about-grid">
        <div className="about-heading">
          <Text as="h2" pt="Tecnologia com propósito. Aprendizado sem pausa." en="Technology with purpose. Learning without limits." id="about-title" />
          {"\n  "}
          <div className="skills-world">
            {"\n    "}
            <div className="skills-globe">
              <canvas aria-hidden="true" />
              <ul>
                <li>
                  <a className="skills-globe-item" href="https://learn.microsoft.com/pt-br/dotnet/csharp/" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/csharp.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"C#"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://www.php.net/docs.php" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/php.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"PHP"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://docs.python.org/pt-br/3/" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/python.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"Python"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/javascript.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"JavaScript"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://dev.java/learn/" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/java.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"Java"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://developer.mozilla.org/pt-BR/docs/Web/HTML" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/html5.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"HTML"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://developer.mozilla.org/pt-BR/docs/Web/CSS" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/css3.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"CSS"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/react.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"React"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://laravel.com/docs" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/laravel.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"Laravel"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://dev.mysql.com/doc/" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/mysql.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"MySQL"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://nodejs.org/pt" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/nodejs.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"Node.js"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/spring.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"Spring Boot"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/bootstrap.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"Bootstrap"}
                    </span>
                  </a>
                </li>
                {"\n"}
                <li>
                  <a className="skills-globe-item" href="https://sqlite.org/docs.html" target="_blank" rel="noopener noreferrer">
                    <span className="globe-icon">
                      <img src="assets/skills/sqlite.svg" alt="" width="32" height="32" loading="lazy" draggable="false" />
                    </span>
                    <span className="globe-name">
                      {"SQLite"}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            {"\n    "}
            <Text as="p" pt="Arraste para girar · Clique para explorar" en="Drag to rotate · Click to explore" className="globe-hint" />
            {"\n    "}
            <div className="globe-controls">
              <Text as="button" pt="Ver lista" en="Show list" className="globe-toggle" type="button" hidden aria-pressed="false" />
              <Text as="button" pt="Pausar rotação" en="Pause rotation" className="globe-pause" type="button" hidden aria-pressed="false" />
            </div>
            {"\n  "}
          </div>
          {"\n"}
        </div>
        <div className="about-content">
          {"\n  "}
          <Text as="p" pt="Sou Enzo Fernandes Alcantara, estudante do 2º período de Engenharia de Software na PUC Minas e formado no ensino médio técnico em Informática pelo Colégio Cotemig. Minha formação me proporcionou contato com programação, redes e manutenção de computadores, e sigo ampliando essa base por meio da graduação e de projetos práticos." en="I am Enzo Fernandes Alcantara, a second-semester Software Engineering student at PUC Minas and a graduate of the technical high school program in Information Technology at Colégio Cotemig. My education introduced me to programming, networks and computer maintenance, and I continue to build on that foundation through my degree and hands-on projects." />
          {"\n  "}
          <Text as="p" pt="Tenho interesse em desenvolvimento full stack e back-end, além de infraestrutura e redes. Atualmente, atuo com análise de dados e rotinas administrativas em uma empresa privada, utilizando inteligência artificial para apoiar processos relacionados a clientes e outras atividades da empresa. Essa experiência me aproxima de desafios reais e das diferentes formas de aplicar tecnologia no trabalho." en="My interests include full-stack and back-end development, infrastructure and networks. I currently work with data analysis and administrative routines at a private company, using artificial intelligence to support customer-related processes and other business activities. This experience brings me closer to real challenges and different ways to apply technology at work." />
          {"\n  "}
          <Text as="p" pt="Gosto de aprender na prática, documentar projetos e buscar soluções claras para problemas reais. Os trabalhos acadêmicos e em equipe me ajudam a desenvolver minha visão sobre o processo de criação de software e a importância da colaboração. Meu objetivo é continuar evoluindo como desenvolvedor até me tornar um programador sênior, aprofundando meus conhecimentos e contribuindo para projetos e equipes." en="I enjoy learning by building, documenting projects and finding clear solutions to real problems. Academic and team projects help me understand the software development process and the value of collaboration. My goal is to keep growing as a developer and become a senior programmer, deepening my knowledge while contributing to projects and teams." />
          {"\n  "}
          <a className="text-link" href="https://www.linkedin.com/in/enzo-fernandes-dev" target="_blank" rel="noopener noreferrer">
            <Text as="span" pt="Conheça meu LinkedIn" en="Visit my LinkedIn" />
            {" ↗"}
          </a>
        </div>
      </div>
      {"\n  "}
      <div className="skills">
        <div>
          <Text as="h3" pt="Desenvolvimento" en="Development" />
          <p>
            {"C# · PHP · Python · JavaScript"}
          </p>
          <p>
            {"React · Laravel · HTML · CSS · MySQL"}
          </p>
        </div>
        <div>
          <Text as="h3" pt="Infraestrutura" en="Infrastructure" />
          <p>
            {"Windows · Linux"}
          </p>
          <Text as="p" pt="Redes · Manutenção de computadores" en="Networks · Computer maintenance" />
        </div>
        <div>
          <Text as="h3" pt="Além do código" en="Beyond code" />
          <Text as="p" pt="IA · Planilhas · Robótica" en="AI · Spreadsheets · Robotics" />
          <Text as="p" pt="Inglês intermediário · Colaboração" en="Intermediate English · Collaboration" />
        </div>
      </div>
      {"\n"}
    </section>
  );
}

export function Experience() {
  return (
    <section className="section wrap" id="experiencias" aria-labelledby="experience-title">
      <div className="section-label">
        <span>
          {"04 /"}
        </span>
        <Text as="span" pt="EXPERIÊNCIAS & FORMAÇÃO" en="EXPERIENCE & EDUCATION" />
      </div>
      <div className="experience-grid">
        <div>
          <Text as="h2" pt="Construindo minha trajetória." en="Building my journey." id="experience-title" />
          <Text as="p" pt="Da formação técnica à graduação e à experiência profissional: cada etapa contribui para a maneira como aprendo e aplico tecnologia no dia a dia." en="From technical education to university and professional experience, each stage shapes how I learn and apply technology every day." className="muted" />
          <button className="experience-pixels" type="button" aria-label="Animar ramificações da trajetória" title="Clique para animar" />
        </div>
        <div className="experience-list">
          {"\n  "}
          <article className="experience">
            <div className="experience-meta">
              <Text as="span" pt="2026 — ATUAL" en="2026 — PRESENT" />
              <Text as="span" pt="PROFISSIONAL" en="PROFESSIONAL" className="badge" />
            </div>
            <Text as="h3" pt="Analista de dados e administração" en="Data and administration analyst" />
            <Text as="h4" pt="Empresa privada" en="Private company" />
            <Text as="p" pt="Atuo com análise de dados e rotinas administrativas em uma empresa privada. No dia a dia, utilizo recursos de inteligência artificial para auxiliar processos relacionados a clientes e apoiar outras atividades da empresa, ampliando meu contato com a aplicação prática da tecnologia." en="I work with data analysis and administrative routines at a private company. I use artificial intelligence tools to assist with customer-related processes and support other business activities, expanding my experience applying technology in practice." />
          </article>
          {"\n  "}
          <article className="experience">
            <div className="experience-meta">
              <Text as="span" pt="EM ANDAMENTO · 2º PERÍODO" en="IN PROGRESS · SECOND SEMESTER" />
              <Text as="span" pt="GRADUAÇÃO" en="DEGREE" className="badge" />
            </div>
            <Text as="h3" pt="Engenharia de Software" en="Software Engineering" />
            <h4>
              {"PUC Minas"}
            </h4>
            <Text as="p" pt="Graduação voltada ao desenvolvimento de software, na qual venho ampliando minha base técnica e colocando conhecimentos em prática por meio de projetos acadêmicos. A formação também fortalece meu interesse em desenvolvimento de aplicações e trabalho em equipe." en="A degree focused on software development, where I am expanding my technical foundation and applying what I learn through academic projects. The program also strengthens my interest in application development and teamwork." />
          </article>
          {"\n  "}
          <article className="experience">
            <div className="experience-meta">
              <Text as="span" pt="CONCLUÍDO" en="COMPLETED" />
              <Text as="span" pt="FORMAÇÃO TÉCNICA" en="TECHNICAL EDUCATION" className="badge" />
            </div>
            <Text as="h3" pt="Técnico em Informática" en="Information Technology" />
            <h4>
              {"Colégio Cotemig"}
            </h4>
            <Text as="p" pt="Ensino médio integrado à formação técnica em Informática, com contato com programação, redes e manutenção de computadores. Essa etapa construiu a base do meu interesse por tecnologia e da minha trajetória na área de software." en="A technical high school program in Information Technology, introducing programming, networks and computer maintenance. This experience built the foundation for my interest in technology and my path into software." />
          </article>
          {"\n"}
        </div>
      </div>
    </section>
  );
}

export function ContactMarkup({onSubmit,sending,status}) {
  const {tr} = useLanguage();
  return (
    <section className="contact-section" id="contato" aria-labelledby="contact-title">
      <div className="wrap section">
        <div className="section-label">
          <span>
            {"05 /"}
          </span>
          <Text as="span" pt="VAMOS CONVERSAR" en="LET'S TALK" />
        </div>
        <div className="contact-grid">
          <div>
            <h2 id="contact-title">
              <Text as="span" pt="Seu próximo projeto" en="Your next project" />
              <br />
              <Text as="span" pt="começa com um olá." en="starts with a hello." className="serif" />
            </h2>
            <Text as="p" pt="Tem uma oportunidade, uma ideia de projeto ou quer trocar experiências sobre tecnologia? Estou aberto a conversas, colaborações e conexões que contribuam para o aprendizado e para a construção de boas soluções." en="Have an opportunity, a project idea or an experience to share about technology? I am open to conversations, collaborations and connections that support learning and the creation of useful solutions." />
            <div className="contact-links">
              {"\n"}
              <a href="mailto:enzofalcantara@gmail.com">
                <span className="social-icon" aria-hidden="true">
                  {"@"}
                </span>
                <span>
                  {"E-mail"}
                  <small>
                    {"enzofalcantara@gmail.com"}
                  </small>
                </span>
                <span aria-hidden="true">
                  {"↗"}
                </span>
              </a>
              {"\n"}
              <a href="https://wa.me/5531995612833" target="_blank" rel="noopener noreferrer">
                <span className="social-icon" aria-hidden="true">
                  {"◉"}
                </span>
                <span>
                  {"WhatsApp"}
                  <Text as="small" pt="Iniciar uma conversa" en="Start a conversation" />
                </span>
                <span aria-hidden="true">
                  {"↗"}
                </span>
              </a>
              {"\n"}
              <a href="https://www.linkedin.com/in/enzo-fernandes-dev" target="_blank" rel="noopener noreferrer">
                <span className="social-icon linkedin" aria-hidden="true">
                  {"in"}
                </span>
                <span>
                  {"LinkedIn"}
                  <Text as="small" pt="Conexões profissionais" en="Professional connections" />
                </span>
                <span aria-hidden="true">
                  {"↗"}
                </span>
              </a>
              {"\n"}
              <a href="https://github.com/enzofernandesnz" target="_blank" rel="noopener noreferrer">
                <span className="social-icon" aria-hidden="true">
                  {"</>"}
                </span>
                <span>
                  {"GitHub"}
                  <small>
                    {"@enzofernandesnz"}
                  </small>
                </span>
                <span aria-hidden="true">
                  {"↗"}
                </span>
              </a>
            </div>
          </div>
          {"\n"}
          <form id="contact-form" action="https://formsubmit.co/enzofalcantara@gmail.com" method="POST" onSubmit={onSubmit} aria-busy={sending ? 'true' : undefined}>
            <Text as="h3" pt="Envie uma mensagem" en="Send a message" />
            <Text as="label" pt="Seu nome" en="Your name" htmlFor="name" />
            <input id="name" name="name" autoComplete="name" required minLength="2" maxLength="100" data-placeholder-pt="Como posso chamar você?" data-placeholder-en="What should I call you?" placeholder={tr("Como posso chamar você?", "What should I call you?")} />
            {"\n"}
            <label htmlFor="email">
              {"E-mail"}
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength="254" data-placeholder-pt="voce@exemplo.com" data-placeholder-en="you@example.com" placeholder={tr("voce@exemplo.com", "you@example.com")} />
            {"\n"}
            <Text as="label" pt="Sua mensagem" en="Your message" htmlFor="message" />
            <textarea id="message" name="message" required minLength="10" maxLength="5000" rows="5" data-placeholder-pt="Conte um pouco sobre sua ideia..." data-placeholder-en="Tell me about your idea..." placeholder={tr("Conte um pouco sobre sua ideia...", "Tell me about your idea...")} />
            {"\n"}
            <input type="hidden" name="_subject" value="Novo contato | Portfólio Enzo Fernandes" />
            <input type="hidden" name="_template" value="table" />
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">
                {"Website"}
              </label>
              <input id="website" name="_honey" tabIndex="-1" autoComplete="off" />
            </div>
            {"\n"}
            <button type="submit" className="button primary send" disabled={sending}>
              <Text as="span" pt="Enviar mensagem" en="Send message" />
              <span aria-hidden="true">
                {"↗"}
              </span>
            </button>
            <Text as="p" pt="Ao enviar, seu nome, e-mail e mensagem serão processados pelo FormSubmit para entrega por e-mail." en="When you submit, your name, email and message are processed by FormSubmit for email delivery." className="form-note" />
            <p id="form-status" role="status">{status}</p>
          </form>
          {"\n"}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="wrap footer">
      <a className="footer-name" href="#inicio">
        {"Enzo Fernandes"}
      </a>
      <p>
        {"© 2026 Enzo Fernandes Alcantara"}
      </p>
      <Text as="a" pt="Voltar ao topo ↑" en="Back to top ↑" href="#inicio" />
    </footer>
  );
}

