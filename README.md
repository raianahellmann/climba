# ClimbaCore 

## Links do Projeto
- **Live Demo:** [https://climba.vercel.app](https://climba.vercel.app)
- **API Backend:** [https://climba.onrender.com](https://climba.onrender.com)

## Tecnologias Utilizadas

### Frontend
- **React.js (Vite):** Performance e agilidade no desenvolvimento.
- **Material UI (MUI):** Interface baseada em Design System profissional com suporte a Dark Mode.
- **Day.js:** Manipulação precisa de datas e formatação brasileira.
- **Axios:** Comunicação assíncrona com a API.

### Backend
- **Node.js & Express:** Servidor escalável e rápido.
- **MySQL2:** Driver moderno com suporte a conexões seguras (SSL).
- **Dotenv:** Gestão de variáveis de ambiente para proteção de credenciais sensíveis.
- **CORS:** Configuração de políticas de segurança entre domínios.

### Infraestrutura (Cloud)
- **Vercel:** Hospedagem do Frontend com deploy contínuo.
- **Render:** Hospedagem do serviço de Backend (API).
- **Aiven:** Banco de dados MySQL gerenciado na nuvem (DBaaS) com alta disponibilidade.

## Arquitetura do Sistema

A aplicação utiliza uma estrutura desacoplada para garantir manutenção e escalabilidade:

1. **Frontend:** Interface React que consome a API via HTTPS.
2. **Backend:** Servidor Node.js que processa a lógica de negócio e validações.
3. **Database:** Persistência de dados em um banco MySQL remoto, garantindo integridade e segurança.

## Como rodar o projeto localmente
1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/raianahellmann/climba.git](https://github.com/raianahellmann/climba.git)