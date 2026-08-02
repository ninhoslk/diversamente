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

export type ConfigMentoria = {
  titulo: string
  subtitulo: string
  etapas: {
    titulo: string
    texto: string
  }[]
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
    titulo: "Programas de Mentoria",
    subtitulo: "Acompanhamento pedagógico personalizado para preparar sua equipe e elevar o padrão de ensino da sua instituição.",
    etapas: [
      {
        titulo: "1. Diagnóstico Institucional",
        texto: "Análise profunda das demandas e desafios específicos da equipe docente para alinhamento pedagógico.",
      },
      {
        titulo: "2. Planejamento de Formação",
        texto: "Elaboração de um cronograma personalizado de encontros práticos e workshops com especialistas.",
      },
      {
        titulo: "3. Acompanhamento Contínuo",
        texto: "Encontros periódicos ao vivo, suporte dedicado e avaliação dos resultados obtidos em sala.",
      },
    ],
    planos: [
      {
        nome: "Mentoria Essencial",
        preco: "Consulte condições",
        destaque: false,
        itens: ["2 encontros mensais ao vivo", "Acesso completo a todas as trilhas", "Materiais e guias exclusivos", "Atendimento via e-mail"],
      },
      {
        nome: "Mentoria Completa",
        preco: "Consulte condições",
        destaque: true,
        itens: [
          "4 encontros mensais ao vivo",
          "Acesso completo às trilhas",
          "Trilha customizada com o nome da sua escola",
          "Canal prioritário no WhatsApp",
          "Relatórios periódicos de acompanhamento",
        ],
      },
    ],
  },
}
