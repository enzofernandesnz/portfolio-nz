# Roteiro de apresentação — Enzo Fernandes

Tempo sugerido: 5 a 7 minutos. Use como apoio e explique com suas próprias palavras.

## 1. Apresentação e objetivo (40 segundos)

“Meu nome é Enzo Fernandes Alcantara e uso nz como nome curto. Desenvolvi este portfólio para centralizar minha formação, meus projetos, minha experiência profissional e meus contatos. Sou estudante de Engenharia de Software na PUC Minas e formado no técnico em Informática pelo Cotemig.”

Abra o site hospedado. Apresente as quatro seções do menu.

## 2. Planejamento e identidade visual (50 segundos)

Mostre os wireframes no Figma. Explique a hierarquia: apresentação, biografia, projetos, experiências e contato. Mostre a versão móvel. Explique a escolha de verde escuro e verde-lima e o uso de capturas dos projetos como conteúdo visual.

## 3. Arquitetura (50 segundos)

“O front-end foi feito em HTML, CSS e JavaScript, sem frameworks. O HTML organiza o conteúdo, o CSS controla layout e responsividade e o JavaScript implementa os idiomas, filtros e a timeline. O formulário envia os dados ao FormSubmit, que faz o processamento e a entrega por e-mail. A hospedagem serve arquivos estáticos.”

Mostre a organização das pastas no README. Diferencie o servidor Node.js usado localmente do serviço de e-mail utilizado em produção.

## 4. Demonstração das funcionalidades (2 minutos)

1. Troque de português para inglês e retorne.
2. Abra Projetos e explique que a ordem usa a data de criação dos repositórios.
3. Demonstre os filtros e abra um repositório. Destaque o Estagi.ON, desenvolvido em grupo no 1º semestre de 2026, e o certificado de melhor projeto de Trabalho Interdisciplinar: Desenvolvimento de Aplicação Web.
4. Amplie uma imagem real de um projeto. Mova o cursor por toda a tela, incluindo as margens laterais, para demonstrar o SplashCursor. Explique que o componente React Bits do exemplo do professor foi adaptado para JavaScript nativo e WebGL, respeitando movimento reduzido.
5. Mostre sua experiência como analista de dados e administração, com uso de IA em processos da empresa.
6. Reduza a largura da janela e use o menu móvel.
7. Demonstre um campo obrigatório ou e-mail inválido sem realizar envio desnecessário.

## 5. Hospedagem e testes (1 minuto)

Mostre o endereço HTTPS e o README. Explique que foram conferidos navegação, idiomas, filtros, modal, validação e larguras de celular, tablet e desktop. Se o formulário já estiver ativado, demonstre um teste controlado e o recebimento real. Se ainda não estiver, informe a pendência claramente.

## 6. Aprendizados (40 segundos)

Comente o que você compreendeu sobre separar conteúdo, apresentação e comportamento; validar dados; adaptar um layout; organizar um repositório; e publicar um site. Revise o código antes de apresentar para conseguir explicar cada parte.

## Perguntas possíveis

**Por que não usou React?** O escopo pode ser atendido com JavaScript nativo; isso reduz dependências e permite demonstrar os fundamentos.

**Onde fica o back-end?** O processamento do contato é feito pelo serviço FormSubmit. Este projeto não mantém API nem banco de dados próprios.

**Como adicionar um projeto?** Incluir um objeto na lista `projects`, com data, nomes, descrições PT/EN, tecnologias, repositório e caminho da imagem.

**Como o site funciona no celular?** CSS Grid/Flexbox e media queries reorganizam o conteúdo em uma coluna e habilitam o menu compacto.

**As imagens são simulações?** A captura do Estagi.ON vem da documentação original da equipe. As demais capturas foram obtidas dos projetos executados localmente. Blocos tipográficos de projetos sem captura não são apresentados como screenshots.
