import type { Metadata } from "next"
import { PageShell } from "@/components/site/page-shell"
import { SITE_EMAIL_CONTATO, SITE_NOME_LEGAL } from "@/lib/site-meta"

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Diversamente coleta, usa e protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
}

const ATUALIZADO_EM = "27 de agosto de 2026"

export default function PoliticaDePrivacidadePage() {
  return (
    <PageShell
      titulo="Política de Privacidade"
      subtitulo={`Última atualização: ${ATUALIZADO_EM}. Esta política descreve como ${SITE_NOME_LEGAL} coleta, usa, compartilha e protege dados pessoais na plataforma Diversamente, em conformidade com a Lei nº 13.709/2018 (LGPD).`}
    >
      <div className="flex flex-col gap-10 text-sm leading-relaxed text-foreground/85 sm:text-base [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:sm:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
        <section className="flex flex-col gap-3">
          <h2>1. Quem trata os seus dados</h2>
          <p>
            {SITE_NOME_LEGAL} é a controladora dos dados pessoais tratados por meio da plataforma Diversamente. Esta
            política se aplica a estudantes, educadores, famílias e administradores das instituições parceiras que
            utilizam a Plataforma.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>2. Dados que coletamos</h2>
          <p>Coletamos as seguintes categorias de dados pessoais:</p>
          <ul>
            <li>
              <strong>Dados de cadastro:</strong> nome, e-mail, papel/perfil (estudante, educador, família ou
              administrador) e turma/categoria de acesso, fornecidos no momento do cadastro pela instituição de
              ensino;
            </li>
            <li>
              <strong>Dados de autenticação:</strong> credenciais de acesso (senha armazenada de forma criptografada
              por nosso provedor de infraestrutura, o Supabase);
            </li>
            <li>
              <strong>Dados de uso e navegação:</strong> páginas visitadas, cliques, tempo de permanência, tipo de
              dispositivo e navegador, coletados de forma agregada por meio de ferramentas de análise (Google
              Analytics e Microsoft Clarity), conforme descrito na seção 5.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2>3. Finalidade do tratamento</h2>
          <p>Os dados pessoais coletados são utilizados para:</p>
          <ul>
            <li>Viabilizar o acesso autenticado e a navegação segura pela Plataforma;</li>
            <li>Controlar o acesso a materiais de acordo com o perfil e a turma do usuário;</li>
            <li>Comunicar-se com o usuário sobre a conta ou sobre a Plataforma;</li>
            <li>Entender o uso da Plataforma para corrigir problemas e melhorar a experiência (analytics);</li>
            <li>Cumprir obrigações legais e regulatórias aplicáveis.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2>4. Compartilhamento de dados</h2>
          <p>
            Não vendemos dados pessoais. Os dados podem ser compartilhados apenas com prestadores de serviço que
            processam dados em nosso nome, sob obrigações contratuais de confidencialidade e segurança:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> — infraestrutura de autenticação e banco de dados que hospeda os dados de
              cadastro;
            </li>
            <li>
              <strong>Google Analytics</strong> — mensuração de audiência e comportamento de navegação, de forma
              agregada;
            </li>
            <li>
              <strong>Microsoft Clarity</strong> — análise de comportamento de navegação (mapas de calor e gravação
              de sessões), com mascaramento de campos sensíveis por padrão da própria ferramenta.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2>5. Cookies e tecnologias de rastreamento</h2>
          <p>
            A Plataforma utiliza cookies e tecnologias semelhantes essenciais ao funcionamento (como manter a sessão
            de login) e cookies de análise (Google Analytics e Microsoft Clarity), que ajudam a entender como os
            visitantes usam o site. Você pode gerenciar ou bloquear cookies diretamente nas configurações do seu
            navegador — isso pode afetar o funcionamento de partes da Plataforma que dependem de sessão ativa.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>6. Seus direitos como titular de dados (LGPD)</h2>
          <p>Nos termos da LGPD, você tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento de seus dados;</li>
            <li>Acessar, corrigir ou atualizar seus dados pessoais;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em excesso;</li>
            <li>Solicitar a portabilidade dos dados a outro fornecedor;</li>
            <li>Revogar o consentimento e solicitar a exclusão de dados tratados com base nele;</li>
            <li>Obter informações sobre com quem seus dados foram compartilhados.</li>
          </ul>
          <p>
            Solicitações podem ser feitas pelo canal de contato indicado na seção 9. Responderemos dentro dos prazos
            estabelecidos pela LGPD.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>7. Segurança da informação</h2>
          <p>
            Adotamos medidas técnicas e administrativas razoáveis para proteger os dados pessoais contra acessos não
            autorizados e situações de destruição, perda, alteração, comunicação ou difusão. O acesso ao catálogo de
            materiais e às áreas administrativas exige autenticação, e as permissões são controladas por perfil de
            usuário.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>8. Retenção de dados</h2>
          <p>
            Os dados pessoais são mantidos pelo tempo necessário ao cumprimento das finalidades descritas nesta
            política, ou conforme exigido por obrigações legais, sendo eliminados ou anonimizados após esse período,
            salvo quando a retenção for exigida por lei.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>9. Alterações desta política</h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente. A versão vigente é sempre a publicada
            nesta página, com a respectiva data de atualização.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>10. Contato</h2>
          <p>
            Para exercer seus direitos como titular de dados ou esclarecer dúvidas sobre esta política, entre em
            contato pelo e-mail{" "}
            <a href={`mailto:${SITE_EMAIL_CONTATO}`} className="font-medium text-primary hover:underline">
              {SITE_EMAIL_CONTATO}
            </a>
            .
          </p>
        </section>
      </div>
    </PageShell>
  )
}
