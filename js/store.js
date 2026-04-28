console.log("Creche Store: Sistema de persistência carregado (v2.1 - Fix: UUID Fallback)");

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).substring(2, 11) + "-" + Date.now().toString(36);
}

const seedData = {
  profiles: [
    {
      id: "direcao",
      nome: "Direcao",
      descricao: "Acesso completo a modulos academicos, financeiros e relatorios."
    },
    {
      id: "secretaria",
      nome: "Secretaria",
      descricao: "Foco em matriculas, cadastros e operacao diaria."
    },
    {
      id: "financeiro",
      nome: "Financeiro",
      descricao: "Controle de cobranca, inadimplencia, impostos e contas."
    }
  ],
  users: [],
  invites: [],
  activeProfileId: "direcao",
  classes: [
    {
      id: generateId(),
      nome: "Bercario Sol",
      etapa: "Bercario",
      turno: "Integral",
      capacidade: 12,
      professor: "Camila Araujo",
      status: "Ativa"
    },
    {
      id: generateId(),
      nome: "Pre 2 Lua",
      etapa: "Pre 2",
      turno: "Manha",
      capacidade: 20,
      professor: "Fernanda Lima",
      status: "Ativa"
    }
  ],
  students: [
    {
      id: generateId(),
      nome: "Helena Rocha",
      turma: "Bercario",
      responsavel: "Ana Rocha",
      telefone: "(11) 98888-1000",
      status: "Ativo"
    },
    {
      id: generateId(),
      nome: "Theo Martins",
      turma: "Pre 2",
      responsavel: "Carlos Martins",
      telefone: "(11) 97777-2200",
      status: "Ativo"
    }
  ],
  staff: [
    {
      id: generateId(),
      nome: "Juliana Costa",
      cargo: "Coordenadora",
      departamento: "Pedagogico",
      admissao: "2025-01-10",
      status: "Ativo"
    },
    {
      id: generateId(),
      nome: "Marcio Nunes",
      cargo: "Auxiliar",
      departamento: "Operacional",
      admissao: "2024-08-01",
      status: "Ativo"
    }
  ],
  tuition: [
    {
      id: generateId(),
      aluno: "Helena Rocha",
      referencia: "2026-03",
      valor: 1450,
      vencimento: "2026-03-10",
      formaPagamento: "Pix",
      status: "Pago"
    },
    {
      id: generateId(),
      aluno: "Theo Martins",
      referencia: "2026-03",
      valor: 1320,
      vencimento: "2026-03-10",
      formaPagamento: "Boleto",
      status: "Em aberto"
    }
  ],
  extras: [
    {
      id: generateId(),
      atividade: "Musicalizacao",
      aluno: "Theo Martins",
      professor: "Lia Prado",
      valor: 180,
      status: "Ativa"
    }
  ],
  delinquency: [
    {
      id: generateId(),
      aluno: "Theo Martins",
      responsavel: "Carlos Martins",
      referencia: "2026-03",
      valor: 1320,
      acao: "Contato pendente",
      status: "Em aberto"
    }
  ],
  receivables: [
    {
      id: generateId(),
      descricao: "Mensalidade Theo Martins",
      categoria: "Mensalidade",
      valor: 1320,
      vencimento: "2026-03-10",
      status: "Vencido"
    },
    {
      id: generateId(),
      descricao: "Mensalidade Helena Rocha",
      categoria: "Mensalidade",
      valor: 1450,
      vencimento: "2026-03-10",
      status: "Recebido"
    }
  ],
  payables: [
    {
      id: generateId(),
      descricao: "Fornecedor de alimentos",
      categoria: "Suprimentos",
      valor: 980,
      vencimento: "2026-04-05",
      status: "Em aberto"
    }
  ],
  taxes: [
    {
      id: generateId(),
      imposto: "ISS",
      competencia: "2026-03",
      valor: 320,
      vencimento: "2026-04-20",
      status: "A recolher"
    }
  ],
  reportCards: [
    {
      id: generateId(),
      aluno: "Theo Martins",
      turma: "Pre 2",
      periodo: "1o Bimestre",
      desenvolvimento: "Excelente evolucao em linguagem, socializacao e coordenacao motora.",
      status: "Publicado"
    }
  ],
  diary: [],
  attendance: [],
  health: [],
  incidents: []
};

class LocalAdapter {
  constructor(key) {
    this.key = key;
  }

  async load() {
    const raw = localStorage.getItem(this.key);
    if (raw) {
      return JSON.parse(raw);
    }
    localStorage.setItem(this.key, JSON.stringify(seedData));
    return structuredClone(seedData);
  }

  async save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
    return data;
  }
}

class FirebaseAdapter {
  constructor(config) {
    this.config = config;
  }

  async load(allowedModules = null) {
    if (!window.crecheFirebaseBridge) {
      throw new Error("Bridge Firebase indisponivel.");
    }
    const data = await window.crecheFirebaseBridge.load(allowedModules);
    return data;
  }

  async save(data) {
    if (!window.crecheFirebaseBridge) {
      throw new Error("Bridge Firebase indisponivel.");
    }
    return window.crecheFirebaseBridge.save(data);
  }
}

window.crecheStore = {
  adapter: null,
  data: null,

  mergeWithSeed(data) {
    const merged = { ...structuredClone(seedData), ...(data || {}) };
    const mergeById = (baseRows, incomingRows) => {
      const incomingMap = new Map((incomingRows || []).map((item) => [item.id, item]));
      const mergedRows = baseRows.map((item) => ({ ...item, ...(incomingMap.get(item.id) || {}) }));
      const extras = (incomingRows || []).filter((item) => !baseRows.some((base) => base.id === item.id));
      return [...mergedRows, ...extras];
    };
    for (const key of Object.keys(seedData)) {
      if (Array.isArray(seedData[key])) {
        const incoming = data?.[key];
        if (key === "profiles") {
          merged[key] = mergeById(structuredClone(seedData[key]), Array.isArray(incoming) ? incoming : []);
        } else {
          merged[key] = Array.isArray(incoming) && incoming.length ? incoming : structuredClone(seedData[key]);
        }
      }
    }
    if (!merged.activeProfileId) {
      merged.activeProfileId = seedData.activeProfileId;
    }
    return merged;
  },

  resolveAdapter() {
    if (
      window.CRECHE_FIREBASE.enabled
      && window.crecheFirebaseBridge
      && window.crecheFirebaseBridge.isAuthenticated()
    ) {
      return new FirebaseAdapter(window.CRECHE_FIREBASE);
    }
    return new LocalAdapter("creche-erp-data");
  },

  async init(allowedModules = null) {
    this.adapter = this.resolveAdapter();
    this.data = await this.adapter.load(allowedModules);
    this.data = this.mergeWithSeed(this.data);
    return this.data;
  },

  async persist() {
    this.adapter = this.resolveAdapter();
    await this.adapter.save(this.data);
  },

  async create(moduleKey, payload) {
    this.data[moduleKey].unshift({ id: generateId(), ...payload });
    await this.persist();
  },

  async update(moduleKey, id, payload) {
    const index = this.data[moduleKey].findIndex((item) => item.id === id);
    if (index === -1) return;
    this.data[moduleKey][index] = { ...this.data[moduleKey][index], ...payload };
    await this.persist();
  },

  async remove(moduleKey, id) {
    this.data[moduleKey] = this.data[moduleKey].filter((item) => item.id !== id);
    await this.persist();
  },

  async updateStatus(moduleKey, id, status) {
    const item = this.data[moduleKey].find((entry) => entry.id === id);
    if (!item) return;
    item.status = status;
    await this.persist();
  },

  async setProfile(profileId) {
    this.data.activeProfileId = profileId;
    await this.persist();
  }
};
