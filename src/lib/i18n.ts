import i18n from "i18next"
import { initReactI18next } from "react-i18next"

export const APP_LOCALE = "pt-BR"
export const APP_CURRENCY = "BRL"

export const currencyFormatter = new Intl.NumberFormat(APP_LOCALE, {
  style: "currency",
  currency: APP_CURRENCY,
  maximumFractionDigits: 0,
})

export const preciseCurrencyFormatter = new Intl.NumberFormat(APP_LOCALE, {
  style: "currency",
  currency: APP_CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const numberFormatter = new Intl.NumberFormat(APP_LOCALE)

export const dateFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
})

export const dateTimeFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

const resources = {
  [APP_LOCALE]: {
    translation: {
      app: {
        htmlLang: APP_LOCALE,
        title: "ReceiptIQ",
        nav: {
          capture: "Captura",
          dashboard: "Painel",
          receipts: "Receitas",
          employees: "Funcionários",
        },
        sidebar: {
          description: "Capture recibos e acompanhe os gastos em tempo real.",
          navigation: "Navegação",
          open: "Abrir navegação",
        },
      },
      dashboard: {
        periods: {
          "7d": "Últimos 7 dias",
          "30d": "30 dias",
          "90d": "90 dias",
          all: "Todo o período",
        },
        categories: {
          food: "Alimentação",
          fuel: "Combustível",
          "office-supplies": "Material de escritório",
          cleaning: "Limpeza",
          other: "Outros",
        },
        loading: "Carregando painel...",
        unavailableTitle: "Painel indisponível",
        unavailableFallback: "Não foi possível carregar os dados de recibos.",
        badge: "ReceiptIQ",
        heroTitle: "Visibilidade e controle",
        heroDescription:
          "Acompanhe gastos por pessoa, produto, categoria e período para entender exatamente para onde o dinheiro está indo.",
        pages: {
          dashboardTitle: "Painel de controle",
          dashboardDescription:
            "Comece pelos alertas e depois valide o panorama de gasto por período, produto e categoria.",
          receiptsTitle: "Receitas e auditoria",
          receiptsDescription:
            "Pesquise, filtre e abra qualquer recibo para conferir a imagem original e os itens extraídos.",
          employeesTitle: "Funcionários e responsabilidade",
          employeesDescription:
            "Veja quem gastou mais, quantos recibos enviou e quais pessoas concentram mais alertas.",
        },
        summary: {
          totalSpent: "Total gasto",
          receiptsProcessed: "Recibos processados",
          employeesWhoSubmitted: "Funcionários que enviaram",
          uniqueProducts: "Produtos únicos identificados",
        },
        sections: {
          employee: {
            title: "Gastos por funcionário",
            description: "Quem está gastando, quanto e em quê.",
            empty: "Ainda não há atividade de funcionários neste período.",
            cta: "Processar o primeiro recibo",
          },
          products: {
            title: "Produtos mais comprados",
            description:
              "Compras repetidas e aquisições redundantes ficam visíveis aqui.",
            empty: "Nenhum gasto por produto foi identificado neste período.",
          },
          categories: {
            title: "Gastos por categoria",
            description:
              "Uma visão proporcional de para onde o dinheiro está indo.",
            empty:
              "Não há gastos categorizados disponíveis para o período selecionado.",
          },
          alerts: {
            title: "Alertas",
            description:
              "Achados concretos: estouros de política, CNPJs ausentes ou inválidos, duplicidades, compras pessoais, padrões de compra fragmentada e variação de preço.",
            empty: "Nenhum alerta ativo exige atenção neste período.",
          },
          history: {
            title: "Histórico de recibos",
            description:
              "Pesquise, filtre e ordene os recibos para conferir a imagem original e os itens extraídos a qualquer momento.",
            empty: "Nenhum recibo foi enviado no período selecionado.",
            cta: "Escanear recibos neste período",
          },
        },
        table: {
          searchLabel: "Buscar",
          searchPlaceholder:
            "Buscar por recibo, data, funcionário, fornecedor ou categoria",
          employeeSearchPlaceholder:
            "Buscar por funcionário ou categoria principal",
          categoryFilter: "Categoria",
          allCategories: "Todas as categorias",
          receipt: "Recibo",
          date: "Data",
          uploadDateTime: "Upload em",
          printedDateTime: "Impresso em",
          employee: "Funcionário",
          receipts: "Recibos",
          merchant: "Fornecedor",
          category: "Categoria",
          amount: "Valor",
          total: "Total",
          alerts: "Alertas",
          previousPage: "Anterior",
          nextPage: "Próxima",
          pageSummary: "Página {{page}} de {{total}}",
          resultSummary: "{{count}} resultados",
          noEmployeeResults:
            "Nenhum funcionário corresponde à busca neste período.",
          noResults: "Nenhum recibo corresponde à busca ou aos filtros.",
        },
        labels: {
          receiptCount: "recibos",
          topCategory: "Categoria principal",
          timesBought: "vezes compradas",
          employees: "funcionários",
          items: "itens",
          tapForDetail: "Toque para ver",
          noReceiptsTitle: "Ainda não há recibos",
          noReceiptsDescription:
            "O painel está pronto. Assim que os funcionários começarem a enviar recibos, você verá quem gasta mais, quais produtos se repetem e onde estão os desvios.",
          openScanner: "Abrir scanner",
          receiptDetail: "Detalhes do recibo",
          selectedReceipt: "Recibo selecionado",
          loadingReceiptDetail: "Carregando detalhes do recibo...",
          receiptDetailUnavailable: "Detalhes indisponíveis",
          receiptDetailUnavailableFallback:
            "Não foi possível abrir o recibo selecionado.",
          employeeDetail: "Detalhes do funcionário",
          employeeReceipts: "Recibos do funcionário",
          employeeDrawerHint:
            "Abra qualquer recibo para verificar a foto original e os itens extraídos.",
          close: "Fechar",
          noAlerts: "Sem alertas",
          noSourceImage:
            "A imagem original não está disponível, mas os itens extraídos continuam visíveis para auditoria.",
          supplier: "Fornecedor",
          employee: "Funcionário",
          receiptDate: "Data do recibo",
          total: "Total",
          vendorTaxId: "CNPJ do fornecedor",
          status: "Status",
          receiptImageAlt: "Imagem do recibo de {{vendorName}}",
          other: "Outros",
          priceAnomaly: "Anomalia de preço",
          missing: "Ausente",
          quantity: "Qtd.",
          each: "cada",
        },
        alerts: {
          metrics: {
            missingId: "Sem ID",
            overLimit: "{{percent}}% acima",
            duplicateReceipts: "{{count}} recibos",
            repeatBuys: "{{count}} compras repetidas",
            priceSpread: "{{percent}}% de diferença",
            overPeers: "{{percent}}% acima da equipe",
          },
          taxInvalid:
            "{{vendorName}} está sem um CNPJ válido no recibo de {{userName}}.",
          policyExceeded:
            "{{userName}} gastou {{categoryTotal}} em {{category}} em {{vendorName}}, acima do limite de {{limitAmount}}.",
          policyMonthlyExceeded:
            "{{category}} acumulou {{totalSpent}} no período, acima do limite mensal de {{limitAmount}}.",
          personalPurchase:
            "A IA classificou o recibo enviado por {{userName}} em {{vendorName}} como provável despesa pessoal.",
          duplicateReceipts:
            "{{count}} recibos de {{vendorName}} têm o mesmo total de {{totalAmount}}.",
          bulkBuying:
            "{{productName}} foi comprado {{count}} vezes por {{employeeCount}} funcionários em vez de ser consolidado.",
          priceRange:
            "{{productName}} varia de {{minPrice}} a {{maxPrice}} dependendo de quem compra.",
          peerOverspend:
            "{{userName}} gastou {{totalSpent}} neste período, contra uma mediana da equipe de {{teamMedian}}.",
        },
        statuses: {
          processing: "Em processamento",
          extracted: "Extraído",
          approved: "Aprovado",
          flagged: "Sinalizado",
          unknown: "Desconhecido",
        },
      },
      scan: {
        loading: "Carregando scanner de recibos...",
        unavailableTitle: "Scanner indisponível",
        unavailableFallback:
          "Não foi possível carregar os dados iniciais da tela de escaneamento.",
        employee: "Funcionário",
        noEmployees:
          "Nenhum funcionário foi encontrado no GraphQL. Adicione um usuário antes de escanear recibos.",
        captureTitle: "Escanear recibo",
        captureDescription:
          "Tire uma foto nítida ou envie um recibo da galeria.",
        captureButton: "Tirar foto ou enviar",
        captureHint:
          "Mantenha o recibo reto e inteiro dentro do enquadramento.",
        confirmPhotoTitle: "Confirmar foto",
        confirmPhotoUploading:
          "Enviando a imagem original para mantê-la disponível para auditoria.",
        confirmPhotoReady: "Se a imagem estiver legível, execute a extração.",
        noImageSelected: "Nenhuma imagem selecionada",
        uploadingNow: "Enviando agora...",
        storedAndReady: "Armazenado com segurança e pronto para análise.",
        waitingUpload: "Aguardando o fim do envio.",
        uploadErrorFallback:
          "Falha ao enviar a foto. Tente outra imagem ou verifique a configuracao do armazenamento.",
        uploadCorsFallback:
          "Falha ao enviar a foto. O bucket R2 parece sem CORS para upload direto do navegador. Libere o origin da app e o metodo PUT no bucket.",
        chooseAnother: "Escolher outra",
        analyze: "Analisar",
        analyzingTitle: "Lendo seu recibo...",
        analyzingDescription:
          "Extraindo os campos do recibo a partir da imagem armazenada.",
        reviewTitle: "Revisar extração",
        reviewDescription: "Corrija qualquer campo antes de salvar no painel.",
        supplier: "Fornecedor",
        supplierPlaceholder: "Nome do fornecedor",
        vendorTaxId: "CNPJ do fornecedor",
        vendorTaxIdPlaceholder: "CNPJ opcional",
        validCnpj: "Formato de CNPJ válido detectado.",
        invalidCnpj:
          "Esse CNPJ será sinalizado se estiver ausente ou inválido.",
        missingCnpjAlert:
          "Fornecedores sem CNPJ válido aparecerão nos alertas do painel.",
        date: "Data",
        total: "Total",
        itemsTitle: "Itens",
        itemsDescription:
          "Toque em qualquer campo para corrigir os valores extraídos.",
        addItem: "Adicionar item",
        noItems: "Ainda não há itens. Adicione o primeiro item manualmente.",
        itemNamePlaceholder: "Nome do produto",
        categoryPlaceholder: "Categoria",
        quantity: "Qtd.",
        unitPrice: "Preço unitário",
        lineTotal: "Total da linha",
        itemSum: "Soma dos itens",
        rescan: "Escanear novamente",
        confirmAndSave: "Confirmar e salvar",
        errorTitle: "Não conseguimos ler esse recibo",
        errorFallback:
          "Tente outra foto ou preencha o recibo manualmente se a extração falhar.",
        currentFile: "Arquivo atual",
        tryAnotherPhoto: "Tentar outra foto",
        enterManually: "Preencher manualmente",
        retryExtraction: "Tentar extrair novamente",
        savedTitle: "Recibo salvo",
        savedFallback: "Pronto para o próximo escaneamento.",
        savedFor: "Salvo para {{name}}. Pronto para o próximo escaneamento.",
      },
    },
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: APP_LOCALE,
  fallbackLng: APP_LOCALE,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
