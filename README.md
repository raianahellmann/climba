# ClimbaCore - Sistema de Gestão de Clientes

O **ClimbaCore** é uma aplicação Full Stack moderna desenvolvida para o desafio técnico da Climba. O projeto foca em uma experiência de usuário fluida (SPA) com uma arquitetura robusta, escalável e totalmente hospedada na nuvem.

## Links do Projeto
- **Live Demo:** [https://climba.vercel.app](https://climba.vercel.app)
- **API Backend:** [https://climba.onrender.com](https://climba.onrender.com)

---

## Tecnologias Utilizadas

### Frontend
- **React.js (Vite):** Performance e agilidade no desenvolvimento.
- **Material UI (MUI):** Interface profissional com suporte a Dark Mode.
- **Day.js:** Manipulação de datas e formatação brasileira.
- **Axios:** Comunicação assíncrona com a API.

### Backend
- **Node.js & Express:** Servidor escalável e rápido.
- **MySQL2:** Driver moderno com suporte a conexões seguras (SSL).
- **Dotenv:** Gestão de variáveis de ambiente para proteção de credenciais.
- **CORS:** Configuração de políticas de segurança entre domínios.

### Infraestrutura (Cloud)
- **Vercel:** Hospedagem do Frontend com deploy contínuo.
- **Render:** Hospedagem do serviço de Backend (API).
- **Aiven:** Banco de dados MySQL gerenciado na nuvem (DBaaS).

---

## Arquitetura e Organização
O projeto foi estruturado para demonstrar organização de camadas e boas práticas:

1. **Frontend:** SPA utilizando Material UI para garantir responsividade e validações em tempo real (E-mail, Datas e campos obrigatórios).
2. **Backend:** Construído em Node.js seguindo o padrão REST, com separação clara entre rotas e lógica.
3. **Database:** Persistência em MySQL remoto (Aiven), com restrição de e-mail único (UNIQUE) e conexão segura.

### Relato de Organização
Para entregar o teste dentro do prazo, organizei o fluxo começando pela configuração do banco de dados na nuvem, seguida pela construção dos endpoints da API. Por fim, desenvolvi a interface no React integrando as validações solicitadas (formato de e-mail, e-mail duplicado e validação de datas). O deploy via Render e Vercel foi escolhido para facilitar a avaliação imediata do projeto em um ambiente de produção real.

---

## Como rodar o projeto localmente

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/raianahellmann/climba.git](https://github.com/raianahellmann/climba.git)

2. **Configuração do Backend:**
   ```bash
cd backend
npm install
# Configure o arquivo .env com as credenciais do banco
node server.js

3. **Configuração do Frontend:**
   ```bash
cd ../frontend
npm install
npm run dev
