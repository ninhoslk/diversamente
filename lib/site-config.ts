export type ConfigPaginaInicial = {
  badge: string
  tituloPrincipal: string
  tituloDestaque: string
  descricao: string
  recursos: {
    titulo: string
    texto: string
  }[]
}

export type AutorItem = {
  id: string
  nome: string
  cargo: string
  foto: string
  especialidades: string[]
  bio: string
}

export type ConfigAutores = {
  titulo: string
  subtitulo: string
  autores: AutorItem[]
  secaoFinalTitulo: string
  secaoFinalTexto: string
}

export type ConfigQuemSomos = {
  titulo: string
  subtitulo: string
  pilares: {
    titulo: string
    texto: string
  }[]
  historiaTitulo: string
  historiaParagrafos: string[]
  estatisticas: {
    valor: string
    rotulo: string
  }[]
}

export type ProgramaFormacao = {
  titulo: string
  topicos: string[]
}

export type CategoriaFormacao = {
  nome: string
  duracao: string
  formato?: string
  programas: ProgramaFormacao[]
}

export type Formador = {
  nome: string
  credencial: string
  bio: string
  lattes?: string
  contato?: string
}

export type ConfigMentoria = {
  titulo: string
  subtitulo: string
  categorias: CategoriaFormacao[]
  etapas: {
    titulo: string
    texto: string
  }[]
  formadores: Formador[]
  planos: {
    nome: string
    preco: string
    destaque: boolean
    itens: string[]
  }[]
}

export type SiteConfig = {
  home: ConfigPaginaInicial
  autores: ConfigAutores
  quemSomos: ConfigQuemSomos
  mentoria: ConfigMentoria
}

/**
 * Mescla a config vinda do Supabase com os padrões locais, seção por seção.
 * O JSON salvo no banco pode ter sido gravado antes de um campo novo ser
 * adicionado ao tipo SiteConfig (ex.: mentoria.categorias e
 * mentoria.formadores) — sem isso, a página quebra ao iterar um campo que
 * não existe no registro salvo anteriormente. Usada tanto no servidor
 * (layout.tsx, para a primeira renderização) quanto no cliente (app-provider.tsx).
 */
export function mesclarConfigComPadrao(config: SiteConfig): SiteConfig {
  return {
    home: { ...CONFIG_PADRAO_SITE.home, ...config.home },
    autores: { ...CONFIG_PADRAO_SITE.autores, ...config.autores },
    quemSomos: { ...CONFIG_PADRAO_SITE.quemSomos, ...config.quemSomos },
    mentoria: { ...CONFIG_PADRAO_SITE.mentoria, ...config.mentoria },
  }
}

export const CONFIG_PADRAO_SITE: SiteConfig = {
  home: {
    badge: "Do berçário ao 5º ano, em um só lugar",
    tituloPrincipal: "Todo o material da sua escola,",
    tituloDestaque: "organizado com excelência e praticidade",
    descricao:
      "A Diversamente reúne PDFs, vídeos e jogos pedagógicos estruturados em trilhas claras para cada faixa etária — oferecendo caminhos exclusivos para o estudante, o educador e a família.",
    recursos: [
      {
        titulo: "Leitura Interativa e Segura",
        texto: "Visualização otimizada diretamente na plataforma, garantindo rápida navegação e experiência sem distrações.",
      },
      {
        titulo: "Vídeos Pedagógicos Selecionados",
        texto: "Conteúdos multimídia curados por especialistas e apresentados em um ambiente protegido e focado na aprendizagem.",
      },
      {
        titulo: "Jogos Educativos Dinâmicos",
        texto: "Atividades interativas projetadas para estimular a autonomia, o raciocínio lógico e o aprendizado significativo.",
      },
    ],
  },
  autores: {
    titulo: "Nossos Autores",
    subtitulo: "Cada material da Diversamente nasce das mãos de quem vive e entende a educação. Conheça a equipe de especialistas que assina nossos conteúdos.",
    autores: [
      {
        id: "a1",
        nome: "Ana Beatriz Moraes",
        cargo: "Coordenadora Pedagógica",
        foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
        especialidades: ["Educação Infantil", "Alfabetização"],
        bio: "Especialista com mais de 18 anos na formação de educadores da primeira infância e desenvolvimento de materiais pedagógicos inclusivos.",
      },
      {
        id: "a2",
        nome: "Carolina Prado",
        cargo: "Especialista em Letramento",
        foto: "https://images.unsplash.com/photo-1580894732413-8472f8899818?w=500&auto=format&fit=crop&q=80",
        especialidades: ["Fundamental I", "Leitura e Escrita"],
        bio: "Mestre em Educação com ampla vivência no desenvolvimento de projetos de incentivo à leitura e metodologias ativas do 1º ao 5º ano.",
      },
      {
        id: "a3",
        nome: "Rafael Antunes",
        cargo: "Designer Educacional & Jogos",
        foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
        especialidades: ["Jogos Pedagógicos", "Tecnologia na Educação"],
        bio: "Desenvolvedor de soluções lúdicas e ambientes digitais interativos voltados ao engajamento de crianças em fase escolar.",
      },
    ],
    secaoFinalTitulo: "Quer publicar seu material conosco?",
    secaoFinalTexto: "Se você é educador ou especialista e deseja compartilhar seus materiais na plataforma Diversamente, entre em contato através da nossa página de Ajuda.",
  },
  quemSomos: {
    titulo: "Quem Somos",
    subtitulo: "Somos um coletivo de educadores apaixonados por transformar a rotina escolar através da organização, inovação e acolhimento.",
    pilares: [
      {
        titulo: "Nossa Missão",
        texto: "Proporcionar a escolas, professores e famílias uma plataforma integrada com conteúdos pedagógicos de alta qualidade organizados por faixas etárias.",
      },
      {
        titulo: "Nossa Visão",
        texto: "Ser a principal referência em curadoria e organização de recursos educacionais para a Educação Infantil e o Ensino Fundamental I no Brasil.",
      },
      {
        titulo: "Nossos Valores",
        texto: "Inclusão, respeito à diversidade, incentivo ao protagonismo infantil e fortalecimento da parceria entre escola e família.",
      },
      {
        titulo: "Como Trabalhamos",
        texto: "Cada conteúdo passa por minuciosa validação pedagógica para garantir máxima relevância em sala de aula e no acompanhamento familiar.",
      },
    ],
    historiaTitulo: "Nossa História",
    historiaParagrafos: [
      "A Diversamente nasceu da união entre ciência, educação e um sonho em comum: construir uma aprendizagem em que cada criança seja vista, compreendida e respeitada em sua singularidade.",
      "Mais do que desenvolver uma coleção, reunimos pesquisadores, educadores e especialistas para transformar anos de estudos em estratégias que fazem sentido na prática, aproximando a neurociência do cotidiano das escolas, das famílias e dos estudantes.",
      "Acreditamos que a inclusão não começa quando adaptamos um material. Ela começa quando planejamos uma educação capaz de acolher diferentes formas de aprender desde o primeiro momento.",
      "Essa é a essência da Diversamente: transformar conhecimento em oportunidades, afeto em conexão e aprendizagem em desenvolvimento.",
    ],
    estatisticas: [],
  },
  mentoria: {
    titulo: "Formação para Escolas e Educadores",
    subtitulo:
      "Uma Solução Educacional Integrada que reúne palestras, cursos, oficinas, assessoria e orientação familiar — fundamentada no Desenho Universal para a Aprendizagem (DUA), na Neurociência Cognitiva e na Educação Inclusiva.",
    categorias: [
      {
        nome: "Palestras",
        duracao: "Duração: 1h a 2h",
        formato: "Temas de sensibilização",
        programas: [
          {
            titulo: "Inclusão que Funciona: da teoria à prática na sala de aula",
            topicos: ["O papel da neurociência na aprendizagem", "Caminhos práticos: aprendizagem para todos os alunos"],
          },
          {
            titulo: "O Cérebro na Sala de Aula: como a neurociência transforma o ensino",
            topicos: ["Funções executivas e aprendizagem", "Atenção, memória e emoção", "Estratégias aplicáveis imediatamente"],
          },
          {
            titulo: "Professor sobrecarregado, aluno desconectado: como reverter esse cenário",
            topicos: ["Sobrecarga docente", "Engajamento real do estudante", "Ferramentas práticas de gestão da aprendizagem"],
          },
          {
            titulo: "Educação Inclusiva na Rede Pública: desafios e soluções escaláveis",
            topicos: ["Inclusão além da adaptação", "Modelos replicáveis", "Impacto sistêmico"],
          },
        ],
      },
      {
        nome: "Cursos",
        duracao: "Duração: 12h a 32h",
        formato: "Formato: presencial e/ou híbrido",
        programas: [
          {
            titulo: "Neuroeducação Aplicada ao Ensino Fundamental I",
            topicos: ["Bases da neurociência", "Perfis neurodivergentes (TDAH, TEA, Dislexia etc.)", "Estratégias baseadas em evidências"],
          },
          {
            titulo: "Desenho Universal para a Aprendizagem (DUA) na prática",
            topicos: ["Planejamento inclusivo", "Diferenciação pedagógica", "Avaliação acessível"],
          },
          {
            titulo: "Alfabetização Multissensorial e Metodologias Ativas",
            topicos: ["Psicogramática Montessori", "Lição dos Três Tempos", "Corpo e movimento na aprendizagem"],
          },
          {
            titulo: "Gestão da Sala de Aula e Autorregulação",
            topicos: ["Rotina e previsibilidade", "Manejo comportamental", "Ferramentas de regulação emocional"],
          },
          {
            titulo: "Estudo de Caso e Implementação do PEI com Intencionalidade Pedagógica",
            topicos: ["Elaboração do Estudo de Caso", "Construção estratégica do PEI", "Metas mensuráveis e monitoramento contínuo"],
          },
        ],
      },
      {
        nome: "Oficinas",
        duracao: "Duração: 2h a 4h",
        formato: "Mão na massa — foco em aplicação imediata",
        programas: [
          {
            titulo: "Construindo Aulas Inclusivas com Desenho Universal da Aprendizagem (DUA)",
            topicos: ["Transformar uma aula tradicional em inclusiva", "Adaptação prática de atividades"],
          },
          {
            titulo: "Neurodesign da Sala de Aula",
            topicos: ["Organização do ambiente", "Uso de cores, estímulos e layout"],
          },
          {
            titulo: "Ferramentas de Autorregulação para o Dia a Dia Escolar",
            topicos: ["Atividades reguladoras", "Pausas ativas", "Estratégias sensoriais"],
          },
          {
            titulo: "Materiais Manipulativos e Aprendizagem Concreta",
            topicos: ["Uso de jogos e recursos físicos", "Transformação de conteúdos abstratos"],
          },
          {
            titulo: "Matemática Além da Conta",
            topicos: [
              "Régua das perguntas investigativas",
              "Mercado Diversamente",
              "Dominó investigativo de frações",
              "Cientistas dos dados",
              "Guia de adaptações inclusivas",
            ],
          },
        ],
      },
      {
        nome: "Orientação Familiar",
        duracao: "Atividades presenciais conduzidas pelos Formadores e Autores",
        programas: [
          {
            titulo: "Educação Infantil (Berçário, Maternal e Pré-escola)",
            topicos: [
              "Construção de rotinas e segurança emocional",
              "Autonomia em alimentação, higiene e autocuidado",
              "Fortalecimento dos vínculos afetivos entre adultos e crianças",
              "Estímulo motor, sensorial, cognitivo e emocional pelo brincar",
              "Uso equilibrado de telas e hábitos saudáveis de sono",
            ],
          },
          {
            titulo: "Ensino Fundamental — Anos Iniciais (1º ao 5º ano)",
            topicos: [
              "Acompanhamento escolar acolhedor e incentivo à autonomia",
              "Curiosidade científica e pensamento investigativo",
              "Organização dos estudos e gestão do tempo",
              "Jogos para leitura, escrita e raciocínio lógico-matemático",
              "Apoio a estudantes com TDAH, TEA e outros perfis de aprendizagem",
            ],
          },
        ],
      },
    ],
    etapas: [
      {
        titulo: "1. Diagnóstico Pedagógico da Rede",
        texto: "Levantamento de necessidades, análise de práticas inclusivas e elaboração de um plano de ação estratégico.",
      },
      {
        titulo: "2. Estruturação de Políticas de Educação Inclusiva",
        texto: "Protocolos institucionais, fluxos de atendimento e integração entre a equipe escolar e a família.",
      },
      {
        titulo: "3. Formação Continuada com Acompanhamento",
        texto: "Encontros periódicos, observação de práticas em sala de aula e feedback técnico contínuo.",
      },
      {
        titulo: "4. Apoio à Gestão Escolar",
        texto: "Estratégias baseadas em evidências, indicadores de aprendizagem e sustentabilidade da implementação.",
      },
    ],
    formadores: [
      {
        nome: "Mel Oliani",
        credencial: "Profa. Ms. Merlyn Mércia Oliani — Educação Física, Mestre em Biodinâmica da Motricidade Humana (UNESP/Rio Claro)",
        bio: "Autora e coautora de 12 artigos científicos, 2 livros e 3 e-books, com mais de 200 orientações de trabalhos acadêmicos. Mentora de profissionais da educação e da saúde no Brasil, em Portugal e em Moçambique, é docente no Centro Universitário Estácio de Ribeirão Preto e idealizadora do Método BrincAção. Atualmente gestora de projetos da EcosBio — Ambiente Sócio-Educacional.",
        lattes: "http://lattes.cnpq.br/8318698374611414",
        contato: "www.meloliani.com.br",
      },
      {
        nome: "Liana Pinto Tubelo",
        credencial: "Formadora e Autora — Educação Física, Neuropsicologia e Método Montessori",
        bio: "Licenciada em Educação Física (UFRGS), com especializações em Psicomotricidade, Neuropsicologia e Método Montessori (0 a 6 anos), e Mestre em Educação pela PUCRS. Palestrante e consultora em diversas cidades do Brasil, é autora de livros como \"A Antropologia do Brinquedo\" e \"Brincar para Todos\", além de docente em cursos de extensão e pós-graduação na UDESC e na UNISAÚDE Educacional.",
        lattes: "http://lattes.cnpq.br/4972372288499637",
        contato: "@lianapintotubelo",
      },
      {
        nome: "Cássia Mariana Bronzon da Costa",
        credencial: "Formadora e Autora — Biomédica, Doutora e Pós-doutora em Ciências (USP Ribeirão Preto)",
        bio: "Pesquisadora e professora universitária, referência na interface entre Imunologia, Parasitologia, Bioquímica Clínica e Educação em Saúde, com projetos financiados por FAPESP, CAPES, CNPq e FAPDF. Atua na formação de profissionais da Biomedicina, Enfermagem, Nutrição, Odontologia e Educação Física, com ampla produção de material didático e curadoria de conteúdos para a YDUQS.",
        lattes: "http://lattes.cnpq.br/0167594593129667",
      },
      {
        nome: "Luiz Miguel Pereira",
        credencial: "Formador e Autor — Farmacêutico-bioquímico, Doutor e Pós-doutor (USP Ribeirão Preto)",
        bio: "Pesquisador em parasitologia molecular e biotecnologia, com múltiplas patentes na produção de proteínas recombinantes. Professor na Estácio Ribeirão Preto em disciplinas como Microbiologia, Farmacologia e Imunologia, é também fundador da SolID Biotecnologia e sócio da Gene de Yebá, unindo ciência de fronteira e produção de material didático autoral.",
        lattes: "http://lattes.cnpq.br/3762822814924600",
      },
    ],
    planos: [
      {
        nome: "Formação Pontual",
        preco: "Sob consulta",
        destaque: false,
        itens: [
          "Palestras de sensibilização (1h a 2h)",
          "Cursos de formação continuada (12h a 32h)",
          "Oficinas mão na massa (2h a 4h)",
          "Formato presencial e/ou híbrido",
        ],
      },
      {
        nome: "Parceria Contínua",
        preco: "Sob consulta",
        destaque: true,
        itens: [
          "Diagnóstico pedagógico da rede",
          "Assessoria contínua para implementação",
          "Formação continuada com acompanhamento",
          "Orientação familiar presencial",
          "Apoio contínuo à gestão escolar",
        ],
      },
    ],
  },
}
