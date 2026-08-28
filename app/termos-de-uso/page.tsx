import type { Metadata } from "next"
import { PageShell } from "@/components/site/page-shell"
import { SITE_EMAIL_CONTATO, SITE_NOME_LEGAL } from "@/lib/site-meta"

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso da plataforma Diversamente e do material didático, de propriedade exclusiva da Editora Diversamente.",
}

const ATUALIZADO_EM = "27 de agosto de 2026"

export default function TermosDeUsoPage() {
  return (
    <PageShell
      titulo="Termos de Uso"
      subtitulo={`Última atualização: ${ATUALIZADO_EM}. Ao acessar ou utilizar a plataforma Diversamente, você concorda integralmente com os termos descritos abaixo.`}
    >
      <div className="flex flex-col gap-10 text-sm leading-relaxed text-foreground/85 sm:text-base [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:sm:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
        <section className="flex flex-col gap-3">
          <h2>1. Aceitação dos termos</h2>
          <p>
            Estes Termos de Uso regulam o acesso e a utilização da plataforma educacional Diversamente
            (&quot;Plataforma&quot;), mantida por {SITE_NOME_LEGAL}
            {" "}(&quot;Diversamente&quot;, &quot;nós&quot;). Ao criar uma conta, fazer login ou navegar pela
            Plataforma, você (&quot;usuário&quot;) declara ter lido,
            compreendido e aceito estes termos em sua totalidade. Caso não concorde com qualquer disposição aqui
            prevista, o uso da Plataforma deve ser interrompido imediatamente.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>2. Objeto</h2>
          <p>
            A Diversamente disponibiliza, mediante acesso restrito e autenticado, um catálogo de material didático
            organizado em trilhas de aprendizagem — Educação Infantil, Ensino Fundamental I e Educação Ambiental —
            composto por PDFs, vídeos, jogos, manuais, projetos, áudios e demais conteúdos pedagógicos
            (&quot;Materiais&quot;), voltado a estudantes, educadores e famílias de instituições de ensino parceiras.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>3. Propriedade intelectual</h2>
          <p>
            Todo o conteúdo disponibilizado na Plataforma — incluindo, sem limitação, textos, PDFs, vídeos, jogos,
            manuais, projetos, áudios, roteiros pedagógicos, ilustrações, layout, identidade visual e a marca
            &quot;Diversamente&quot; — é de propriedade exclusiva de {SITE_NOME_LEGAL} ou de terceiros que a
            licenciaram para tal, sendo protegido pela Lei nº 9.610/1998 (Lei de Direitos Autorais) e demais normas
            aplicáveis de propriedade intelectual.
          </p>
          <p>
            É expressamente proibida a reprodução, distribuição, cópia, modificação, engenharia reversa,
            comercialização, sublicenciamento, publicação em outras plataformas ou qualquer outra forma de
            utilização dos Materiais, total ou parcial, sem autorização prévia e expressa, por escrito, de{" "}
            {SITE_NOME_LEGAL}. O descumprimento desta cláusula sujeita o infrator às sanções civis e criminais
            previstas em lei, incluindo indenização por perdas e danos.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>4. Licença de uso concedida ao usuário</h2>
          <p>
            Mediante cadastro autorizado pela instituição de ensino parceira, {SITE_NOME_LEGAL} concede ao usuário uma
            licença de uso:
          </p>
          <ul>
            <li>Pessoal e intransferível — vinculada exclusivamente à conta cadastrada;</li>
            <li>Não exclusiva e revogável a qualquer momento, a critério de {SITE_NOME_LEGAL};</li>
            <li>Limitada a fins pedagógicos, no âmbito da instituição de ensino à qual o usuário está vinculado;</li>
            <li>Sem direito a sublicenciamento, cessão ou uso comercial dos Materiais.</li>
          </ul>
          <p>
            Essa licença não transfere ao usuário qualquer direito de propriedade sobre os Materiais, permanecendo
            estes, em sua integralidade, sob titularidade de {SITE_NOME_LEGAL}.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>5. Cadastro e responsabilidade da conta</h2>
          <p>
            O acesso à Plataforma é restrito a usuários cadastrados pela administração escolar. O usuário é
            responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades
            realizadas em sua conta. Qualquer suspeita de uso não autorizado deve ser comunicada imediatamente à
            equipe da Diversamente.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>6. Condutas proibidas</h2>
          <p>É vedado ao usuário, entre outras condutas:</p>
          <ul>
            <li>Compartilhar credenciais de acesso com terceiros não autorizados;</li>
            <li>Extrair, baixar em massa ou automatizar a coleta de Materiais (scraping);</li>
            <li>Utilizar a Plataforma para fins ilícitos, discriminatórios ou que violem direitos de terceiros;</li>
            <li>Tentar contornar mecanismos de segurança, autenticação ou controle de acesso da Plataforma.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2>7. Disponibilidade do serviço</h2>
          <p>
            {SITE_NOME_LEGAL} empenha-se para manter a Plataforma disponível de forma contínua, mas não garante
            disponibilidade ininterrupta, podendo realizar manutenções programadas ou emergenciais que impliquem
            indisponibilidade temporária, sem aviso prévio quando necessário.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>8. Alterações destes termos</h2>
          <p>
            {SITE_NOME_LEGAL} pode alterar estes Termos de Uso a qualquer momento, para refletir mudanças legais,
            regulatórias ou operacionais. A versão vigente é sempre a publicada nesta página, com a respectiva data
            de atualização.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>9. Legislação aplicável e foro</h2>
          <p>
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro do
            domicílio de {SITE_NOME_LEGAL} para dirimir quaisquer controvérsias decorrentes destes termos, com
            renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2>10. Contato</h2>
          <p>
            Dúvidas sobre estes Termos de Uso ou solicitações de autorização de uso de Materiais podem ser
            encaminhadas para{" "}
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
