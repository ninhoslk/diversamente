import type { Metadata } from "next"
import { Clock, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageShell } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "Ajuda | Diversamente",
  description: "Central de ajuda da Diversamente: perguntas frequentes e canais de contato.",
}

const FAQ = [
  {
    pergunta: "Como acesso os materiais da minha turma?",
    resposta:
      "Após entrar, vá em Conteúdos, escolha a trilha (Educação Infantil ou Fundamental I), a categoria da faixa etária e depois a aba do seu público: Criança/Estudante, Educador ou Família.",
  },
  {
    pergunta: "Os conteúdos são adaptados para cada público?",
    resposta:
      "Sim. A plataforma divide os acessos de forma organizada para que cada perfil (estudante, educador ou família) visualize os recursos pertinentes.",
  },
  {
    pergunta: "Os vídeos possuem curadoria e ambiente seguro?",
    resposta:
      "Os vídeos são selecionados e exibidos em um leitor próprio dentro da plataforma, sem distrações e sem sugestões de conteúdos externos.",
  },
  {
    pergunta: "Minha escola pode ter uma trilha personalizada?",
    resposta: "Sim. Esse formato faz parte do plano Completo de mentoria. Fale com a equipe pedagógica pelo WhatsApp.",
  },
]

export default function AjudaPage() {
  return (
    <PageShell
      titulo="Ajuda"
      subtitulo="Tire suas dúvidas sobre a plataforma ou fale diretamente com nossa equipe de suporte pedagógico."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Perguntas frequentes</h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((item) => (
              <Card key={item.pergunta} className="glass rounded-3xl border shadow-sm">
                <CardContent className="flex flex-col gap-2 p-6">
                  <h3 className="font-semibold">{item.pergunta}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.resposta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Canais de contato</h2>
          <Card className="glass-strong rounded-3xl border shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <Button asChild size="lg" className="w-full justify-center text-center rounded-full">
                <a href="https://wa.me/5519992101212" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                  <span>Conversar no WhatsApp</span>
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full justify-center text-center rounded-full bg-card/80">
                <a href="mailto:ecosbioambiental@gmail.com" className="flex items-center justify-center gap-2">
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  <span>Enviar um e-mail</span>
                </a>
              </Button>
              <div className="flex items-start gap-2 rounded-2xl bg-secondary/70 p-4 text-left text-sm text-secondary-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="leading-relaxed">
                  Atendimento de segunda a sexta, das 9h às 18h. Respondemos e-mails em até 1 dia útil.
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageShell>
  )
}
