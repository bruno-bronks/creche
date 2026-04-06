const schoolStages = ["Bercario", "Maternal 1", "Maternal 2", "Pre 1", "Pre 2"];
const brazilStates = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const fallbackProfiles = [
  { id: "direcao", nome: "Direcao", descricao: "Acesso completo a modulos academicos, financeiros e relatorios." },
  { id: "secretaria", nome: "Secretaria", descricao: "Foco em matriculas, cadastros e operacao diaria." },
  { id: "financeiro", nome: "Financeiro", descricao: "Controle de cobranca, inadimplencia, impostos e contas." }
];

const modules = {
  dashboard: {
    label: "Início",
    description: "Visão geral do sistema e indicadores rápidos.",
    tableDescription: "Resumo executivo da escola."
  },
  health: {
    label: "Saúde",
    description: "Controle de alergias, medicamentos e informações médicas dos alunos.",
    tableDescription: "Histórico de saúde e cuidados especiais por aluno.",
    fields: [
      { name: "aluno", label: "Aluno", type: "select", sourceCollection: "students", required: true },
      { name: "tipo", label: "Tipo", type: "select", options: ["Alergia", "Medicamento", "Tipo Sanguíneo", "Observação"], required: true },
      { name: "descricao", label: "Descrição/Dosagem", type: "textarea", required: true },
      { name: "horario", label: "Horário (se aplicável)", type: "text", required: false },
      { name: "status", label: "Status", type: "select", options: ["Ativo", "Resolvido", "Urgente"], required: true }
    ],
    columns: ["aluno", "tipo", "status"]
  },
  incidents: {
    label: "Ocorrências",
    description: "Registro de incidentes escolares, quedas ou feedbacks comportamentais.",
    tableDescription: "Mural de eventos extraordinários e acompanhamento de alunos.",
    fields: [
      { name: "data", label: "Data", type: "date", required: true },
      { name: "aluno", label: "Aluno", type: "select", sourceCollection: "students", required: true },
      { name: "categoria", label: "Categoria", type: "select", options: ["Comportamento", "Acidente", "Feedback Positivo", "Outros"], required: true },
      { name: "relato", label: "Relato detalhado", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: ["Pendente", "Pais Notificados", "Arquivado"], required: true }
    ],
    columns: ["data", "aluno", "categoria", "status"]
  },
  invites: {
    label: "Acessos",
    description: "Convites para novos usuarios do sistema com papel predefinido.",
    tableDescription: "Gestao de acessos para secretaria, financeiro e direcao.",
    fields: [
      { name: "email", label: "E-mail do usuario", type: "text", required: true },
      { name: "role", label: "Perfil", type: "select", options: ["direcao", "secretaria", "financeiro"], required: true },
      { name: "code", label: "Codigo do convite", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: ["Ativo", "Utilizado", "Cancelado"], required: true }
    ],
    columns: ["email", "role", "code", "status"]
  },
  users: {
    label: "Usuarios",
    description: "Gestao de contas autenticadas e perfis operacionais.",
    tableDescription: "Administracao de papeis para usuarios ja cadastrados.",
    fields: [
      { name: "email", label: "E-mail", type: "text", required: true },
      { name: "role", label: "Perfil", type: "select", options: ["direcao", "secretaria", "financeiro"], required: true },
      { name: "status", label: "Status", type: "select", options: ["Ativo", "Bloqueado"], required: true }
    ],
    columns: ["email", "role", "status"]
  },
  classes: {
    label: "Turmas",
    description: "Organizacao de salas, turnos, capacidade e professor responsavel.",
    tableDescription: "Mapa operacional de turmas e distribuicao de vagas.",
    fields: [
      { name: "nome", label: "Nome da turma", type: "text", required: true },
      { name: "etapa", label: "Etapa", type: "select", options: schoolStages, required: true },
      { name: "turno", label: "Turno", type: "select", options: ["Manha", "Tarde", "Integral"], required: true },
      { name: "capacidade", label: "Capacidade", type: "number", required: true },
      { name: "professor", label: "Professor responsavel", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: ["Ativa", "Planejamento", "Encerrada"], required: true }
    ],
    columns: ["nome", "etapa", "turno", "capacidade", "professor", "status"]
  },
  students: {
    label: "Alunos",
    description: "Cadastro academico, turma, responsavel e status da matricula.",
    tableDescription: "Base central de alunos para a secretaria escolar.",
    fields: [
      { name: "foto", label: "Foto do Aluno", type: "file", accept: "image/*", required: false },
      { name: "nome", label: "Nome do aluno", type: "text", required: true },
      { name: "dataNascimento", label: "Data de Nascimento", type: "date", required: true },
      { name: "turma", label: "Turma", type: "select", sourceCollection: "classes", required: true },
      { name: "responsavel", label: "Responsavel", type: "text", required: true },
      { name: "email", label: "E-mail do Responsável", type: "email", required: false },
      { name: "telefone", label: "Telefone", type: "text", required: true },
      { name: "cep", label: "CEP", type: "text", required: false },
      { name: "endereco", label: "Endereço", type: "text", required: false },
      { name: "complemento", label: "Complemento", type: "text", required: false },
      { name: "bairro", label: "Bairro", type: "text", required: false },
      { name: "cidade", label: "Cidade", type: "text", required: false },
      { name: "estado", label: "Estado", type: "select", options: brazilStates, required: false },
      { name: "pne", label: "Possui Necessidades Especiais?", type: "select", options: ["Não", "Sim"], required: false },
      { name: "pneQual", label: "Qual?", type: "text", required: false },
      { name: "valorMensalidade", label: "Valor Mensalidade Base", type: "number", required: true, step: "0.01" },
      { name: "status", label: "Status", type: "select", options: ["Ativo", "Em adaptacao", "Inativo"], required: true }
    ],
    columns: ["foto", "nome", "turma", "responsavel", "status"]
  },
  staff: {
    label: "Funcionarios",
    description: "Equipe pedagogica, administrativa e operacional.",
    tableDescription: "Controle de quadro funcional e situacao contratual.",
    fields: [
      { name: "foto", label: "Foto", type: "file", accept: "image/*", required: false },
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "dataNascimento", label: "Data de Nascimento", type: "date", required: true },
      { name: "cargo", label: "Cargo", type: "text", required: true },
      { name: "departamento", label: "Departamento", type: "text", required: true },
      { name: "email", label: "E-mail", type: "email", required: true },
      { name: "telefone", label: "Telefone", type: "text", required: true },
      { name: "cep", label: "CEP", type: "text", required: false },
      { name: "endereco", label: "Endereço", type: "text", required: false },
      { name: "complemento", label: "Complemento", type: "text", required: false },
      { name: "bairro", label: "Bairro", type: "text", required: false },
      { name: "cidade", label: "Cidade", type: "text", required: false },
      { name: "estado", label: "Estado", type: "select", options: brazilStates, required: false },
      { name: "possuiFilhos", label: "Possui Filhos?", type: "select", options: ["Não", "Sim"], required: false },
      { name: "pne", label: "Possui Necessidades Especiais?", type: "select", options: ["Não", "Sim"], required: false },
      { name: "pneQual", label: "Qual?", type: "text", required: false },
      { name: "admissao", label: "Admissao", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: ["Ativo", "Ferias", "Desligado"], required: true }
    ],
    columns: ["foto", "nome", "cargo", "departamento", "status"]
  },
  tuition: {
    label: "Mensalidades",
    description: "Lancamento da cobranca com forma e data de pagamento.",
    tableDescription: "Titulos de mensalidade por aluno e referencia.",
    fields: [
      { name: "aluno", label: "Aluno", type: "select", sourceCollection: "students", required: true },
      { name: "referencia", label: "Referencia", type: "month", required: true },
      { name: "valor", label: "Valor", type: "number", required: true, step: "0.01" },
      { name: "vencimento", label: "Vencimento", type: "date", required: true },
      { name: "formaPagamento", label: "Forma de pagamento", type: "select", options: ["Pix", "Boleto", "Cartao", "Dinheiro", "Transferencia"], required: true },
      { name: "status", label: "Status", type: "select", options: ["Pago", "Em aberto", "Atrasado"], required: true }
    ],
    columns: ["aluno", "referencia", "valor", "status"]
  },
  delinquency: {
    label: "Inadimplencia",
    description: "Acompanhamento de titulos vencidos, contatos e acordos.",
    tableDescription: "Registros de cobranca e tratativa com responsaveis.",
    fields: [
      { name: "aluno", label: "Aluno", type: "select", sourceCollection: "students", required: true },
      { name: "referencia", label: "Referencia", type: "month", required: true },
      { name: "valor", label: "Valor", type: "number", required: true, step: "0.01" },
      { name: "acao", label: "Acao realizada", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: ["Em aberto", "Em negociacao", "Acordo fechado", "Quitado"], required: true }
    ],
    columns: ["aluno", "referencia", "valor", "status"]
  },
  extras: {
    label: "Atividades Extras",
    description: "Contraturno, oficinas e servicos complementares.",
    tableDescription: "Atividades adicionais vinculadas ao aluno.",
    fields: [
      { name: "atividade", label: "Atividade", type: "text", required: true },
      { name: "aluno", label: "Aluno", type: "select", sourceCollection: "students", required: true },
      { name: "professor", label: "Professor responsavel", type: "select", sourceCollection: "staff", required: true },
      { name: "valor", label: "Valor", type: "number", required: true, step: "0.01" },
      { name: "status", label: "Status", type: "select", options: ["Ativa", "Pausada", "Encerrada"], required: true }
    ],
    columns: ["atividade", "aluno", "valor", "status"]
  },
  receivables: {
    label: "Contas a Receber",
    description: "Receitas operacionais, extras e cobrancas eventuais.",
    tableDescription: "Controle de recebimentos da escola.",
    fields: [
      { name: "descricao", label: "Descricao", type: "text", required: true },
      { name: "categoria", label: "Categoria", type: "text", required: true },
      { name: "valor", label: "Valor", type: "number", required: true, step: "0.01" },
      { name: "vencimento", label: "Vencimento", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: ["Recebido", "Em aberto", "Vencido"], required: true }
    ],
    columns: ["descricao", "categoria", "valor", "vencimento", "status"]
  },
  payables: {
    label: "Contas a Pagar",
    description: "Fornecedores, folha, manutencao e despesas gerais.",
    tableDescription: "Compromissos financeiros da operacao.",
    fields: [
      { name: "descricao", label: "Descricao", type: "text", required: true },
      { name: "categoria", label: "Categoria", type: "text", required: true },
      { name: "valor", label: "Valor", type: "number", required: true, step: "0.01" },
      { name: "vencimento", label: "Vencimento", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: ["Pago", "Em aberto", "Vencido"], required: true }
    ],
    columns: ["descricao", "categoria", "valor", "vencimento", "status"]
  },
  taxes: {
    label: "Impostos",
    description: "Competencia, obrigacao tributaria e recolhimento.",
    tableDescription: "Agenda fiscal e pendencias do colegio.",
    fields: [
      { name: "imposto", label: "Imposto", type: "text", required: true },
      { name: "competencia", label: "Competencia", type: "month", required: true },
      { name: "valor", label: "Valor", type: "number", required: true, step: "0.01" },
      { name: "vencimento", label: "Vencimento", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: ["Pago", "A recolher", "Em atraso"], required: true }
    ],
    columns: ["imposto", "competencia", "valor", "vencimento", "status"]
  },
  reportCards: {
    label: "Relatórios",
    description: "Acompanhamento pedagogico por periodo e publicacao para familias.",
    tableDescription: "Registros descritivos do desenvolvimento infantil.",
    fields: [
      { name: "aluno", label: "Aluno", type: "text", required: true },
      { name: "turma", label: "Turma", type: "select", options: schoolStages, required: true },
      { name: "periodo", label: "Periodo", type: "text", required: true },
      { name: "desenvolvimento", label: "Parecer descritivo", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: ["Rascunho", "Publicado"], required: true }
    ],
    columns: ["aluno", "turma", "periodo", "desenvolvimento", "status"]
  },
  diary: {
    label: "Diário de Classe",
    description: "Registro de atividades diárias, temas abordados e ocorrências.",
    tableDescription: "Histórico pedagógico diário das turmas.",
    fields: [
      { name: "data", label: "Data", type: "date", required: true },
      { name: "turma", label: "Turma", type: "select", options: schoolStages, required: true },
      { name: "atividade", label: "Atividade/Tema", type: "text", required: true },
      { name: "observacoes", label: "Observações", type: "textarea", required: false },
      { name: "status", label: "Status", type: "select", options: ["Rascunho", "Finalizado"], required: true }
    ],
    columns: ["data", "turma", "atividade", "status"]
  },
  attendance: {
    label: "Frequência",
    description: "Controle de presença diária dos alunos por turma.",
    tableDescription: "Registro de assiduidade académica.",
    fields: [
      { name: "data", label: "Data", type: "date", required: true },
      { name: "aluno", label: "Aluno", type: "text", required: true },
      { name: "turma", label: "Turma", type: "select", options: schoolStages, required: true },
      { name: "presenca", label: "Presença", type: "select", options: ["Presente", "Ausente", "Justificado"], required: true }
    ],
    columns: ["data", "aluno", "turma", "presenca"]
  }
};

const state = {
  currentModule: "dashboard",
  search: "",
  editingId: null,
  loading: false,
  isInitializing: false,
  sync: {
    enabled: false,
    authenticated: false,
    uid: null,
    email: null,
    role: "direcao",
    reason: "local-mode"
  }
};

const rolePermissions = {
  direcao: Object.keys(modules),
  financeiro: ["dashboard", "tuition", "delinquency", "receivables", "payables", "taxes", "extras", "profiles"],
  secretaria: ["dashboard", "students", "classes", "staff", "reportCards", "diary", "attendance", "health", "incidents", "profiles"]
};

function getEffectiveRole() {
  if (!window.crecheStore || !window.crecheStore.data) return "direcao";
  const role = state.sync.role || window.crecheStore.data.activeProfileId || "direcao";
  return String(role).trim().toLowerCase();
}

function errorMessage(error) {
  if (error && typeof error === "object") {
    const maybeMessage = error.message || error.code || error.details;
    if (maybeMessage) return String(maybeMessage);
  }
  return String(error || "Erro inesperado.");
}

function setFeedback(targetId, message, type = "info") {
  const element = document.querySelector(`#${targetId}`);
  if (!element) return;
  if (!message) {
    element.hidden = true;
    element.textContent = "";
    element.className = "feedback";
    return;
  }
  element.hidden = false;
  element.textContent = message;
  element.className = `feedback ${type}`;
}

function setLoading(next) {
  state.loading = next;
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = next;
  });
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function titleFromField(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Data Masking Utils
const masks = {
  phone: (v) => {
    v = v.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 10) {
      return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (v.length > 6) {
      return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (v.length > 2) {
      return v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      return v.replace(/(\d*)/, "($1");
    }
  },
  cpf: (v) => {
    v = v.replace(/\D/g, "");
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
  },
  cep: (v) => {
    v = v.replace(/\D/g, "");
    if (v.length > 5) {
      return v.replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);
    }
    return v.substring(0, 5);
  },
  money: (v) => {
    v = v.replace(/\D/g, "");
    v = (Number(v) / 100).toFixed(2).replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return "R$ " + v;
  }
};

function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let cpfs = cpf.split("");
  let v1 = 0, v2 = 0;
  for (let i = 0; i < 9; i++) {
    v1 += cpfs[i] * (10 - i);
    v2 += cpfs[i] * (11 - i);
  }
  v1 = (v1 * 10) % 11;
  v2 = ((v2 + v1 * 2) * 10) % 11;
  return v1 % 10 === Number(cpfs[9]) && v2 % 10 === Number(cpfs[10]);
}

function applyMasks(form) {
  const phoneFields = form.querySelectorAll('input[name*="telefone"], input[name*="celular"]');
  const moneyFields = form.querySelectorAll('input[name*="valor"]');
  const cpfFields = form.querySelectorAll('input[name*="cpf"]');
  const cepFields = form.querySelectorAll('input[name*="cep"]');

  phoneFields.forEach(f => {
    f.addEventListener("input", (e) => e.target.value = masks.phone(e.target.value));
  });
  moneyFields.forEach(f => {
    f.addEventListener("input", (e) => e.target.value = masks.money(e.target.value));
  });
  cpfFields.forEach(f => {
    f.addEventListener("input", (e) => e.target.value = masks.cpf(e.target.value));
  });
  cepFields.forEach(f => {
    f.addEventListener("input", (e) => e.target.value = masks.cep(e.target.value));
  });
}

function processImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function generateReceipt(moduleKey, record) {
  const isFinance = ["tuition", "receivables", "payables", "delinquency"].includes(moduleKey);
  const isReportCard = moduleKey === "reportCards";
  const title = isFinance ? "RECIBO ESCOLAR" : (isReportCard ? "BOLETIM ESCOLAR" : `RELATÓRIO: ${modules[moduleKey].label}`);
  const dateStr = new Date().toLocaleDateString("pt-BR");
  
  const content = `
    <div class="receipt-print">
      <header class="receipt-header">
        <h1>${title}</h1>
        <p>Creche ERP | Academic Sanctuary</p>
        <small>Emissão: ${dateStr}</small>
      </header>
      <hr>
      <section class="receipt-body">
        ${modules[moduleKey].fields.map(f => `
          <p><strong>${f.label}:</strong> ${record[f.name] || "---"}</p>
        `).join("")}
      </section>
      <hr>
      <footer class="receipt-footer">
        <p>Documento gerado digitalmente para fins de controle interno.</p>
        <div class="signature">Assinatura Responsável</div>
      </section>
    </div>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Recibo - ${record.id}</title>
        <link rel="stylesheet" href="./app.css">
        <style>
          body { background: white; padding: 40px; color: black; }
          .receipt-print { max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 8px; }
          .receipt-header { text-align: center; margin-bottom: 20px; }
          .receipt-header h1 { margin: 0; color: #4338ca; }
          .receipt-body p { margin: 10px 0; font-size: 1.1rem; border-bottom: 1px dashed #f0f0f0; padding-bottom: 5px; }
          .receipt-footer { margin-top: 40px; text-align: center; font-size: 0.9rem; color: #666; }
          .signature { margin-top: 60px; border-top: 1px solid #000; display: inline-block; width: 250px; padding-top: 10px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body onload="window.print();window.close();">
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
}

function singularLabel(module) {
  return module.label.endsWith("s") ? module.label.slice(0, -1) : module.label;
}

function getStatusClass(status) {
  const normalized = String(status).toLowerCase();
  if (normalized.includes("pago") || normalized.includes("recebido") || normalized.includes("ativo") || normalized.includes("publicado") || normalized.includes("quitado") || normalized.includes("ativa")) {
    return "ok";
  }
  if (normalized.includes("aberto") || normalized.includes("adaptacao") || normalized.includes("negociacao") || normalized.includes("recolher") || normalized.includes("rascunho") || normalized.includes("planejamento")) {
    return "warn";
  }
  return "danger";
}

function activeProfile() {
  const profiles = Array.isArray(window.crecheStore.data?.profiles) && window.crecheStore.data.profiles.length
    ? window.crecheStore.data.profiles
    : fallbackProfiles;
  const activeId = getEffectiveRole();
  return profiles.find((item) => item.id === activeId)
    || profiles[0]
    || fallbackProfiles[0];
}

function metricCards(data) {
  const alunos = data.students.length;
  const turmas = data.classes.filter((item) => item.status === "Ativa").length;
  const funcionarios = data.staff.filter((item) => item.status === "Ativo").length;
  const receitaAberta = data.receivables.filter((item) => item.status !== "Recebido").reduce((sum, item) => sum + Number(item.valor), 0);
  const despesasAbertas = data.payables.filter((item) => item.status !== "Pago").reduce((sum, item) => sum + Number(item.valor), 0);
  const inadimplentes = data.delinquency.filter((item) => item.status !== "Quitado").length;
  
  const totalPresence = data.attendance.filter(a => a.presenca === "Presente").length;
  const totalAttendance = data.attendance.length;
  const attendanceRate = totalAttendance > 0 ? ((totalPresence / totalAttendance) * 100).toFixed(1) : "100";

  return [
    { label: "Alunos matriculados", value: alunos, note: `${turmas} turmas ativas` },
    { label: "Assiduidade Media", value: `${attendanceRate}%`, note: "Presenca registrada" },
    { label: "Receita em aberto", value: formatCurrency(receitaAberta), note: `${inadimplentes} casos em cobranca` },
    { label: "Despesas em aberto", value: formatCurrency(despesasAbertas), note: `${data.invites.filter((item) => item.status === "Ativo").length} convites ativos` }
  ];
}

function renderDashboard(data) {
  const dashboard = document.querySelector("#dashboard");
  if (!dashboard || !data) return;

  const stats = {
    students: {
      total: (data.students || []).length,
      active: (data.students || []).filter(s => s.status === "Ativo").length,
      waiting: (data.students || []).filter(s => s.status === "Fila").length
    },
    billing: {
      totalExpected: (data.tuition || []).reduce((sum, t) => sum + Number(t.valor), 0),
      delinquentCount: (data.delinquency || []).filter(d => d.status !== "Quitado").length,
      lateTotal: (data.delinquency || []).filter(d => d.status !== "Quitado").reduce((sum, d) => sum + Number(d.valor), 0)
    },
    staff: {
      total: (data.staff || []).length,
      active: (data.staff || []).filter(s => s.status === "Ativo").length
    }
  };

  // 1. Premium Hero Section
  dashboard.innerHTML = `
    <div class="dashboard-hero">
      <div class="hero-content">
        <span class="hero-badge">Sistemas Creche ERP</span>
        <h1>Olá, Diretor(a)</h1>
        <p>Seja bem-vindo(a) ao painel de controle. Aqui estão as métricas mais importantes da sua instituição para hoje.</p>
        
        <div class="hero-stats">
          <div class="hero-stat-item">
            <strong>${stats.students.active}</strong>
            <span>Alunos Ativos</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat-item">
            <strong>${stats.staff.active}</strong>
            <span>Colaboradores</span>
          </div>
        </div>

        <div class="hero-actions">
          <button type="button" id="hero-quick-add" class="btn-primary" style="background: #ffffff; color: var(--primary); padding: 14px 28px; border-radius: 12px; font-weight: 700; border: none; box-shadow: var(--shadow-md); cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="plus-circle"></i> Acesso Rápido
          </button>
        </div>
      </div>

      <div class="hero-image">
        <div class="hero-illustration" style="background-image: url('assets/dashboard_hero.png')"></div>
      </div>
    </div>

    <!-- Metrics Summary -->
    <div class="metrics-grid">
      <div class="metric-card primary">
        <div class="metric-icon"><i data-lucide="users"></i></div>
        <div class="metric-info">
          <h3>Comunidade Escolar</h3>
          <div class="metric-value">${stats.students.total}</div>
          <p class="metric-note">Total de matrículas</p>
        </div>
      </div>

      <div class="metric-card warning">
        <div class="metric-icon"><i data-lucide="alert-triangle"></i></div>
        <div class="metric-info">
          <h3>Fila de Espera</h3>
          <div class="metric-value">${stats.students.waiting}</div>
          <p class="metric-note">Novas solicitações</p>
        </div>
      </div>

      <div class="metric-card success">
        <div class="metric-icon"><i data-lucide="trending-up"></i></div>
        <div class="metric-info">
          <h3>Fluxo Mensal</h3>
          <div class="metric-value">${formatCurrency(stats.billing.totalExpected)}</div>
          <p class="metric-note">Previsão bruta</p>
        </div>
      </div>

      <div class="metric-card info">
        <div class="metric-icon"><i data-lucide="shield-alert"></i></div>
        <div class="metric-info">
          <h3>Pendências Financ.</h3>
          <div class="metric-value">${stats.billing.delinquentCount}</div>
          <p class="metric-note">Atrasos identificados</p>
        </div>
      </div>
    </div>

    <!-- Reports Section -->
    <div class="report-strip">
      <div class="report-card">
        <div class="report-header">
          <h3><i data-lucide="bar-chart-2" style="color: var(--primary);"></i> Panorama Acadêmico</h3>
          <button class="btn-link" id="dash-link-students">Ver todos</button>
        </div>
        <div class="report-content">
          <div class="progress-group">
            <div class="progress-info">
              <span>Alunos Pagantes</span>
              <strong>${Math.round((stats.students.active / (stats.students.total || 1)) * 100)}%</strong>
            </div>
            <div class="progress-container">
              <div class="progress-fill" style="width: ${Math.round((stats.students.active / (stats.students.total || 1)) * 100)}%"></div>
            </div>
          </div>
          
          <div class="data-item">
            <span class="label">Capacidade Utilizada</span>
            <span class="value">85%</span>
          </div>
          <div class="data-item">
            <span class="label">Novos este mês</span>
            <span class="value">+12 alunos</span>
          </div>
        </div>
      </div>

      <div class="report-card">
        <div class="report-header">
          <h3><i data-lucide="dollar-sign" style="color: var(--success);"></i> Resumo Financeiro</h3>
          <button class="btn-link" id="dash-link-finance">Detalhes</button>
        </div>
        <div class="report-content">
          <div class="financial-grid">
            <div class="financial-item">
              <span class="label">Em aberto</span>
              <strong>${formatCurrency(stats.billing.lateTotal)}</strong>
            </div>
            <div class="financial-item positive">
              <span class="label">Recebido</span>
              <strong>${formatCurrency(stats.billing.totalExpected - stats.billing.lateTotal)}</strong>
            </div>
          </div>
          
          <div class="data-item" style="margin-top: 16px;">
            <span class="label">Ticket Médio</span>
            <span class="value">R$ 1.250,00</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fast Actions -->
    <div class="quick-actions">
      <h4>Ações Estratégicas</h4>
      <div class="actions-wrapper">
        <button class="btn-primary" id="dash-action-matricula">
          <i data-lucide="user-plus"></i> Matricular Aluno
        </button>
        <button class="btn-secondary" id="dash-action-staff">
          <i data-lucide="briefcase"></i> Novo Professor
        </button>
        <button class="btn-secondary" id="dash-action-delinquency">
          <i data-lucide="mail"></i> Cobrança em Massa
        </button>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Attach dynamic event listeners
  dashboard.querySelector("#hero-quick-add").addEventListener("click", () => { state.currentModule = "students"; render(); });
  dashboard.querySelector("#dash-link-students").addEventListener("click", () => { state.currentModule = "students"; render(); });
  dashboard.querySelector("#dash-link-finance").addEventListener("click", () => { state.currentModule = "tuition"; render(); });
  
  dashboard.querySelector("#dash-action-matricula").addEventListener("click", () => {
    state.currentModule = "students";
    state.editingId = null;
    render();
    renderForm();
    toggleSlideOver(true);
  });
  
  dashboard.querySelector("#dash-action-staff").addEventListener("click", () => {
    state.currentModule = "staff";
    state.editingId = null;
    render();
    renderForm();
    toggleSlideOver(true);
  });

  dashboard.querySelector("#dash-action-delinquency").addEventListener("click", () => {
    state.currentModule = "delinquency";
    render();
  });
}


function renderQuickActions() {
  const container = document.querySelector("#quick-actions");
  if (!container) return;

  const role = getEffectiveRole();
  const isDashboard = state.currentModule === "dashboard" && !state.search && !state.editingId; 

  if (!isDashboard || !["direcao", "financeiro"].includes(role)) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  const currentMonth = new Date().toISOString().slice(0, 7);

  container.innerHTML = `
    <h4>Ações Rápidas</h4>
    <button type="button" id="batch-billing-btn" class="btn-primary">
      <span>💰</span> Faturamento ${currentMonth}
    </button>
    <button type="button" id="export-json-btn" class="btn-secondary">
      <span>💾</span> Backup Sistema
    </button>
  `;

  const batchBtn = document.querySelector("#batch-billing-btn");
  if (batchBtn) {
    batchBtn.addEventListener("click", async () => {
      if (!confirm(`Deseja gerar as mensalidades de todos os alunos ativos para ${currentMonth}?`)) return;
      try {
        setLoading(true);
        const result = await window.crecheBilling.generateMonthlyBatch(currentMonth);
        alert(`Faturamento concluído!\nGerados: ${result.createdCount}\nPulados (já existentes): ${result.skippedCount}`);
        render();
      } catch (error) {
        alert("Erro ao processar faturamento: " + error.message);
      } finally {
        setLoading(false);
      }
    });
  }

  const exportBtn = document.querySelector("#export-json-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const dataStr = JSON.stringify(window.crecheStore.data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `creche-erp-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}



function openWhatsApp(moduleKey, record) {
  const phone = String(record.telefone || "").replace(/\D/g, "");
  if (!phone) {
    alert("Telefone não cadastrado para este registro.");
    return;
  }

  let message = "";
  const aluno = record.aluno || record.nome || "aluno(a)";
  
  if (moduleKey === "health") {
    message = `Olá! Informamos que o aluno(a) *${aluno}* teve uma intercorrência de saúde (${record.tipo}) agora há pouco. Detalhes: ${record.descricao}. Favor entrar em contato se necessário.`;
  } else if (moduleKey === "incidents") {
    message = `Olá! Registramos uma ocorrência de *${record.categoria}* envolvendo o aluno(a) *${aluno}*. Relato: ${record.relato}. Atenciosamente, Equipe Sementinha do Amor.`;
  } else if (moduleKey === "tuition" || moduleKey === "delinquency") {
    message = `Olá! Gostaríamos de lembrar sobre a mensalidade de *${aluno}* ref. a ${record.referencia} no valor de ${formatCurrency(record.valor)}. Status atual: ${record.status}. Qualquer dúvida, estamos à disposição no Financeiro.`;
  }

  const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function renderProfiles() {
  const select = document.querySelector("#profile-select");
  if (!select) return;

  const profiles = Array.isArray(window.crecheStore.data?.profiles) && window.crecheStore.data.profiles.length
    ? window.crecheStore.data.profiles
    : fallbackProfiles;
  select.innerHTML = profiles.map((profile) => `<option value="${profile.id}">${profile.nome}</option>`).join("");
  const activeId = state.sync.role || window.crecheStore.data.activeProfileId;
  select.value = activeId;
  select.disabled = Boolean(state.sync.role);
}

function renderAuthStatus() {
  const loginScreen = document.querySelector("#login-screen");
  const appWrapper = document.querySelector("#app-wrapper");
  const authTriggerText = document.querySelector("#auth-status-text");
  const authIcon = document.querySelector("#auth-status-icon");
  const authBadge = document.querySelector("#auth-status-badge");
  
  const welcomeSection = document.querySelector("#welcome-section");
  const userFullname = document.querySelector("#user-fullname");
  const userPhoto = document.querySelector("#user-photo");
  const logoutBtnTop = document.querySelector("#logout-button-top");

  if (state.sync.authenticated) {
    if (loginScreen) loginScreen.hidden = true;
    if (appWrapper) appWrapper.hidden = false;
    
    // Busca informações estendidas no cadastro de funcionários
    const currentUserEmail = (state.sync.email || "").trim().toLowerCase();
    const staffList = Array.isArray(window.crecheStore.data.staff) ? window.crecheStore.data.staff : [];
    const staffMember = staffList.find(s => {
      const staffEmail = (s.email || "").trim().toLowerCase();
      return staffEmail && staffEmail === currentUserEmail;
    });
    
    // Texto do Badge (Módulo) - Apenas Informativo
    const moduleName = state.sync.role ? state.sync.role.charAt(0).toUpperCase() + state.sync.role.slice(1) : "Acesso";
    if (authTriggerText) authTriggerText.textContent = moduleName;
    if (authIcon) authIcon.textContent = "✅";
    if (authBadge) authBadge.style.display = "flex";
    
    // Info na Welcome Bar (Esquerda)
    if (welcomeSection) welcomeSection.style.display = "block";
    if (userFullname) {
      userFullname.textContent = staffMember?.nome || state.sync.nome || moduleName || "Usuário";
    }
    if (userPhoto) {
      if (staffMember?.photo) {
        userPhoto.innerHTML = "";
        userPhoto.style.backgroundImage = `url(${staffMember.photo})`;
      } else {
        userPhoto.innerHTML = "📸";
        userPhoto.style.backgroundImage = "";
      }
    }
    if (logoutBtnTop) logoutBtnTop.style.display = "flex";
  } else {
    if (loginScreen) loginScreen.hidden = false;
    if (appWrapper) appWrapper.hidden = true;
    if (welcomeSection) welcomeSection.style.display = "none";
    if (authBadge) authBadge.style.display = "none";
    if (logoutBtnTop) logoutBtnTop.style.display = "none";
  }
}

function renderNav() {
  const nav = document.querySelector("#nav");
  if (!nav) return;
  
  const role = getEffectiveRole() || state.sync.role || "direcao";
  const permitted = rolePermissions[role] || [];
  
  // Mapeamento de ícones Lucide para os módulos
  const icons = {
    dashboard: "layout-dashboard",
    students: "graduation-cap",
    staff: "users",
    tuition: "banknote",
    receivables: "line-chart",
    payables: "trending-down",
    delinquency: "alert-circle",
    health: "activity",
    incidents: "file-text",
    invites: "send",
    users: "user-check",
    backups: "hard-drive"
  };

  nav.innerHTML = Object.entries(modules)
    .filter(([key]) => permitted.includes(key))
    .map(([key, module]) => `
      <button type="button" data-module="${key}" class="nav-link ${state.currentModule === key ? "active" : ""}">
        <span class="nav-icon"><i data-lucide="${icons[key] || "square"}"></i></span>
        <span class="nav-label">${module.label}</span>
      </button>
    `).join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }

  nav.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentModule = button.dataset.module;
      state.search = "";
      state.editingId = null;
      const searchInput = document.querySelector("#search-input");
      if (searchInput) searchInput.value = "";
      
      // Auto-collapse sidebar on mobile after selection
      if (window.innerWidth <= 768) {
        toggleSidebar(true);
      }
      
      render();
    });
  });
}

function normalizeValue(field, value) {
  if (field.type === "number") return Number(value);
  return value;
}

function inputMarkup(field, record = {}) {
  const common = `name="${field.name}" ${field.required ? "required" : ""}`;
  const value = record[field.name] ?? "";
  
  if (field.type === "file") {
    const hasPhoto = value && value.startsWith("data:image");
    return `
      <div class="field field-photo" data-field="${field.name}">
        <label>${field.label}</label>
        <div class="photo-uploader">
          <div class="photo-preview" id="preview-${field.name}" style="${hasPhoto ? `background-image: url(${value})` : ""}">
            ${!hasPhoto ? "<span>📸</span>" : ""}
          </div>
          <input type="file" name="${field.name}_file" accept="${field.accept || "image/*"}" id="file-${field.name}">
          <input type="hidden" name="${field.name}" value="${value}">
          <small>Clique para escolher foto</small>
        </div>
      </div>
    `;
  }
  if (field.type === "select") {
    let options = field.options || [];
    
    // Dynamic source collection support
    if (field.sourceCollection && window.crecheStore.data[field.sourceCollection]) {
      options = window.crecheStore.data[field.sourceCollection].map(item => {
        // Use 'nome' or 'email' or the first available logical field as the option label
        return item.nome || item.email || item.descricao || item.id;
      });
    }

    return `
      <div class="field">
        <label>${field.label}</label>
        <select ${common} data-source="${field.sourceCollection || ""}">
          <option value="">Selecione...</option>
          ${options.map((option) => `<option value="${option}" ${value === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      </div>
    `;
  }
  if (field.type === "textarea") {
    return `
      <div class="field">
        <label>${field.label}</label>
        <textarea ${common}>${value}</textarea>
      </div>
    `;
  }
  return `
    <div class="field">
      <label>${field.label}</label>
      <input type="${field.type}" value="${value}" ${common} ${field.step ? `step="${field.step}"` : ""}>
    </div>
  `;
}

function currentRecord() {
  const moduleData = window.crecheStore.data[state.currentModule];
  if (!moduleData || !Array.isArray(moduleData)) return null;
  return moduleData.find((item) => item.id === state.editingId) || null;
}

function toggleSlideOver(show = true) {
  const slideOver = document.querySelector("#slide-over");
  slideOver.hidden = !show;
}

function renderForm() {
  const module = modules[state.currentModule];
  if (!module || !module.fields) return;
  const record = currentRecord();
  const isUsersModule = state.currentModule === "users";
  
  const titleEl = document.querySelector("#form-title");
  const descEl = document.querySelector("#form-description");
  if (titleEl) titleEl.textContent = state.editingId ? `Editar ${singularLabel(module)}` : `Novo ${singularLabel(module)}`;
  if (descEl) descEl.textContent = module.description;
  
  const formElement = document.querySelector("#entity-form");
  if (!formElement) return;
  
  formElement.innerHTML = `
    <div class="form-grid">
      ${module.fields.map((field) => inputMarkup(field, record || {})).join("")}
    </div>
    <div class="actions">
      <button type="submit" class="btn-primary btn-block">${isUsersModule ? "Atualizar Perfil" : "Salvar Alterações"}</button>
    </div>
  `;

  // Apply real-time masks to fields
  applyMasks(formElement);

  // Dynamic Relationship logic
  const alunoSelect = formElement.querySelector('select[name="aluno"]');
  if (alunoSelect) {
    alunoSelect.addEventListener("change", (e) => {
      const alunoNome = e.target.value;
      const students = window.crecheStore?.data?.students || [];
      const alunoData = students.find(s => s.nome === alunoNome);
      
      if (alunoData) {
        // Auto-fill value for tuition/extras/delinquency
        const valorInput = formElement.querySelector('input[name="valor"]');
        if (valorInput && !valorInput.value && (state.currentModule === "tuition" || state.currentModule === "delinquency")) {
          valorInput.value = masks.money(String(alunoData.valorMensalidade * 100)); // applyMoneyMask expects integers
        }
      }
    });
  }

  // Photo handling
  module.fields.filter(f => f.type === "file").forEach(field => {
    const fileInput = formElement.querySelector(`#file-${field.name}`);
    const hiddenInput = formElement.querySelector(`input[name="${field.name}"]`);
    const preview = formElement.querySelector(`#preview-${field.name}`);

    if (fileInput) {
      fileInput.addEventListener("change", async (e) => {
        if (e.target.files && e.target.files[0]) {
          try {
            const base64 = await processImage(e.target.files[0]);
            hiddenInput.value = base64;
            preview.style.backgroundImage = `url(${base64})`;
            preview.innerHTML = "";
          } catch (err) {
            alert("Erro ao processar imagem.");
          }
        }
      });
    }
  });

  // Conditional visibility for PNE
  const pneSelect = formElement.querySelector('select[name="pne"]');
  const pneQualField = formElement.querySelector('[name="pneQual"]')?.closest(".field");
  if (pneSelect && pneQualField) {
    const togglePne = () => {
      pneQualField.hidden = pneSelect.value !== "Sim";
    };
    pneSelect.addEventListener("change", togglePne);
    togglePne();
  }

  formElement.onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {};
    let firstInvalid = null;

    module.fields.forEach((field) => {
      const rawValue = formData.get(field.name);
      if (field.name.includes("cpf") && rawValue && !isValidCPF(rawValue)) {
        firstInvalid = `CPF ${rawValue} inválido.`;
      }
      payload[field.name] = normalizeValue(field, rawValue);
    });

    if (firstInvalid) {
      setFeedback("module-feedback", firstInvalid, "error");
      return;
    }

    try {
      setLoading(true);
      if (state.currentModule === "invites" && window.crecheFirebaseBridge?.issueInvite) {
        await window.crecheFirebaseBridge.issueInvite(payload.email, payload.role, payload.code);
      } else if (state.currentModule === "users" && window.crecheFirebaseBridge?.assignUserRole) {
        const current = currentRecord();
        if (current?.id) await window.crecheFirebaseBridge.assignUserRole(current.id, payload.role);
      } else if (state.editingId) {
        await window.crecheStore.update(state.currentModule, state.editingId, payload);
      } else {
        await window.crecheStore.create(state.currentModule, payload);
      }
      
      await window.crecheStore.init();
      state.editingId = null;
      toggleSlideOver(false);
      render();
    } catch (error) {
      setFeedback("module-feedback", errorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };
}

function renderHeader() {
  const module = modules[state.currentModule];
  const header = document.querySelector("#module-header"); // Get header element first
  const indicatorTitle = document.querySelector("#current-module-title");
  const indicatorIcon = document.querySelector("#current-module-icon");
  
  // Sync Top Bar Indicators (Moved above header check to ensure they always update)
  const icons = {
    dashboard: "🏠",
    students: "🎓",
    staff: "👥",
    tuition: "💰",
    receivables: "📈",
    payables: "📉",
    delinquency: "⚠️",
    health: "🏥",
    incidents: "📝",
    invites: "📩",
    users: "👤",
    backups: "💾",
    reportCards: "📜",
    diary: "📔",
    attendance: "📅",
    classes: "🏫",
    extras: "⭐",
    taxes: "🏛️"
  };

  if (indicatorTitle && module) {
    indicatorTitle.textContent = module.label;
  }
  if (indicatorIcon) {
    indicatorIcon.textContent = icons[state.currentModule] || "📦";
  }

  if (!header || !module) return;

  const isDashboard = state.currentModule === "dashboard" && !state.search && !state.editingId;

  if (isDashboard) {
    header.classList.add("header-dashboard");
    header.innerHTML = `
      <div class="module-titles">
        <h1>Olá, Sementinha! 👋</h1>
        <p>Seja bem-vindo ao painel de controle da sua creche.</p>
      </div>
    `;
  } else {
    header.classList.remove("header-dashboard");
    header.innerHTML = `
      <div class="header-content-wrapper">
        <div class="module-titles">
          <span class="module-breadcrumb">Gerenciamento / ${module.label}</span>
          <h2>${module.label}</h2>
        </div>
        <div class="header-actions">
          <button type="button" id="new-record-btn-top" class="btn-primary shadow-sm">
            <span>+</span> Novo Registro
          </button>
        </div>
      </div>
    `;

    const newBtnTop = header.querySelector("#new-record-btn-top");
    if (newBtnTop) {
      newBtnTop.addEventListener("click", () => {
        state.editingId = null;
        renderForm();
        toggleSlideOver(true);
      });
    }
  }

  // Update table titles only if they exist and we are not on dashboard
  const tableTitle = document.querySelector("#table-title");
  if (tableTitle) tableTitle.textContent = isDashboard ? "" : module.label;
  
  const tableDesc = document.querySelector("#table-description");
  if (tableDesc) tableDesc.textContent = isDashboard ? "" : module.tableDescription;
}

function stringifyCell(value) {
  if (value && typeof value === "string" && value.startsWith("data:image")) {
    return `<img src="${value}" class="table-avatar" alt="Foto">`;
  }
  if (typeof value === "number") return formatCurrency(value);
  return String(value || "---");
}

function filteredRows() {
  const rows = window.crecheStore.data[state.currentModule];
  if (!rows || !Array.isArray(rows)) return [];
  if (!state.search) return rows;
  const term = state.search.toLowerCase();
  return rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(term)));
}

function renderTable() {
  const module = modules[state.currentModule];
  if (!module || !module.columns) return;
  const rows = filteredRows();
  const container = document.querySelector("#table-container");

  if (!rows || !rows.length) {
    container.innerHTML = `<div class="empty-state">Nenhum registro encontrado para este modulo.</div>`;
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          ${module.columns.map((column) => `<th>${titleFromField(column)}</th>`).join("")}
          <th>Acoes</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            ${module.columns.map((column) => column === "status"
              ? `<td><span class="pill ${getStatusClass(row[column])}">${row[column]}</span></td>`
              : `<td>${stringifyCell(row[column])}</td>`
            ).join("")}
            <td>
              <div class="mini-actions">
                ${["health", "incidents", "delinquency", "tuition"].includes(state.currentModule)
                  ? `<button type="button" class="btn-whatsapp" data-action="whatsapp" data-id="${row.id}" title="WhatsApp"><i data-lucide="message-circle"></i></button>`
                  : ""}
                ${["tuition", "receivables", "payables", "delinquency", "students", "reportCards"].includes(state.currentModule) 
                  ? `<button type="button" class="btn-secondary" data-action="receipt" data-id="${row.id}" title="${state.currentModule === "reportCards" ? "Ver PDF" : "Ver Recibo"}"><i data-lucide="file-text"></i></button>` 
                  : ""}
                <button type="button" class="btn-secondary" data-action="edit" data-id="${row.id}" title="Editar"><i data-lucide="edit-3"></i></button>
                <button type="button" class="btn-secondary" data-action="toggle" data-id="${row.id}" title="Alternar Status"><i data-lucide="refresh-cw"></i></button>
                <button type="button" class="btn-secondary" data-action="delete" data-id="${row.id}" title="Excluir"><i data-lucide="trash-2"></i></button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      try {
        setLoading(true);
        setFeedback("module-feedback", "");
        if (action === "receipt") {
          const row = window.crecheStore.data[state.currentModule].find((item) => item.id === id);
          if (row) generateReceipt(state.currentModule, row);
          return;
        }
        if (action === "whatsapp") {
          const row = window.crecheStore.data[state.currentModule].find((item) => item.id === id);
          if (row) {
            // Se for saúde ou ocorrência, precisamos do telefone do cadastro do aluno
            if (["health", "incidents", "tuition", "delinquency"].includes(state.currentModule)) {
              const alunoNome = row.aluno;
              const students = window.crecheStore?.data?.students || [];
              const aluno = students.find(s => s.nome === alunoNome);
              if (aluno && aluno.telefone) {
                row.telefone = aluno.telefone;
              }
            }
            openWhatsApp(state.currentModule, row);
          }
          return;
        }
        if (action === "edit") {
          if (state.currentModule === "invites") return;
          state.editingId = id;
          renderForm();
          toggleSlideOver(true);
          return;
        }
        if (action === "delete") {
          if (state.currentModule === "invites" && window.crecheFirebaseBridge?.revokeInvite) {
            await window.crecheFirebaseBridge.revokeInvite(id);
            await window.crecheStore.init();
            render();
            setFeedback("module-feedback", "Convite revogado com sucesso.");
            return;
          }
          await window.crecheStore.remove(state.currentModule, id);
          if (state.editingId === id) state.editingId = null;
          render();
          setFeedback("module-feedback", "Registro excluido com sucesso.");
          return;
        }
        if (state.currentModule === "users" && window.crecheFirebaseBridge?.assignUserRole) {
          const row = window.crecheStore.data.users.find((item) => item.id === id);
          if (!row) return;
          const options = ["direcao", "secretaria", "financeiro"];
          const currentIndex = options.indexOf(row.role);
          const nextRole = options[(currentIndex + 1) % options.length];
          await window.crecheFirebaseBridge.assignUserRole(id, nextRole);
          await window.crecheStore.init();
          render();
          setFeedback("module-feedback", "Perfil do usuario alterado com sucesso.");
          return;
        }
        const row = window.crecheStore.data[state.currentModule].find((item) => item.id === id);
        const statusField = modules[state.currentModule].fields.find((field) => field.name === "status");
        if (!row || !statusField) return;
        const currentIndex = statusField.options.indexOf(row.status);
        const nextStatus = statusField.options[(currentIndex + 1) % statusField.options.length];
        await window.crecheStore.updateStatus(state.currentModule, id, nextStatus);
        render();
        setFeedback("module-feedback", "Status atualizado com sucesso.");
      } catch (error) {
        setFeedback("module-feedback", errorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    });
  });
}

function renderSyncStatus() {
  const el = document.querySelector("#sync-status");
  if (!el) return;

  let text = "Modo local ativo";
  if (state.sync.enabled && state.sync.authenticated) {
    text = `Firebase: ${window.CRECHE_FIREBASE.projectId} | ${state.sync.email || state.sync.uid}`;
  } else if (window.CRECHE_FIREBASE.enabled && !state.sync.enabled) {
    text = "Aguardando inicialização...";
  }
  el.textContent = text;
}

function toggleSidebar(force) {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  
  if (typeof force === "boolean") {
    sidebar.classList.toggle("sidebar-collapsed", force);
  } else {
    sidebar.classList.toggle("sidebar-collapsed");
  }
}

function attachToolbar() {
  // Sidebar Toggles
  const toggles = document.querySelectorAll(".sidebar-toggle, .sidebar-toggle-top");
  toggles.forEach(btn => {
    btn.addEventListener("click", () => toggleSidebar());
  });

  // Mobile Auto-Close Sidebar on click outside
  document.addEventListener("click", (e) => {
    const sidebar = document.querySelector(".sidebar");
    const isMobile = window.innerWidth <= 768;
    if (isMobile && sidebar && !sidebar.classList.contains("sidebar-collapsed")) {
      if (!sidebar.contains(e.target) && !e.target.closest(".sidebar-toggle-top")) {
        toggleSidebar(true);
      }
    }
  });
  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      state.search = event.target.value.trim();
      renderTable();
    });
  }

  const resetBtn = document.querySelector("#reset-button");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.search = "";
      state.editingId = null;
      if (searchInput) searchInput.value = "";
      setFeedback("module-feedback", "");
      render();
    });
  }

  const printBtn = document.querySelector("#print-button");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  const profileSelect = document.querySelector("#profile-select");
  if (profileSelect) {
    profileSelect.addEventListener("change", async (event) => {
      const newRole = event.target.value;
      state.sync.role = newRole;
      await window.crecheStore.setProfile(newRole);
      render(); 
    });
  }

  const authFormFull = document.querySelector("#auth-form-full");
  if (authFormFull) {
    authFormFull.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      if (!window.crecheFirebaseBridge) {
        setFeedback("auth-feedback-full", "Erro técnico: A conexão com o servidor (Bridge) ainda não foi estabelecida. Por favor, aguarde 5 segundos e tente novamente.", "error");
        console.error("Login abortado: window.crecheFirebaseBridge está nulo. Verifique os logs do firebase-client.js.");
        return;
      }
      const formData = new FormData(event.currentTarget);
      
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "").trim();
      const nome = String(formData.get("nome") || "").trim();
      const role = String(formData.get("role") || "direcao");
      const inviteCode = String(formData.get("inviteCode") || "").trim();

      const isRegistering = !document.querySelector("#register-fields").hidden;

      try {
        setLoading(true);
        let profile;
        
        if (isRegistering) {
          if (!nome || !email || !password) {
             throw new Error("Nome, E-mail e Senha sao obrigatorios para o cadastro.");
          }
          setFeedback("auth-feedback-full", "Criando sua conta...");
          profile = await window.crecheFirebaseBridge.register(nome, email, password, role, inviteCode);
        } else {
          setFeedback("auth-feedback-full", "Entrando...");
          profile = await window.crecheFirebaseBridge.signIn(email, password);
        }
        
        if (profile) {
          state.sync.authenticated = true;
          state.sync.role = profile.role || "direcao";
          await window.crecheStore.init(rolePermissions[state.sync.role]);
          
          document.querySelector("#register-fields").hidden = true;
          if (document.querySelector("#invite-field")) document.querySelector("#invite-field").hidden = true;
          document.querySelector("#toggle-register").textContent = "Não tem conta? Use um convite";
          document.querySelector("#auth-form-full button[type='submit']").textContent = "Entrar no Sistema";
          
          render(); 
          setFeedback("auth-feedback-full", "Login realizado com sucesso.");
        }
      } catch (error) {
        setFeedback("auth-feedback-full", errorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    });
  }

  const toggleRegister = document.querySelector("#toggle-register");
  if (toggleRegister) {
    toggleRegister.addEventListener("click", () => {
      const registerFields = document.querySelector("#register-fields");
      const inviteField = document.querySelector("#invite-field");
      const submitBtn = document.querySelector("#auth-form-full button[type='submit']");

      if (registerFields.hidden) {
        registerFields.hidden = false;
        if (inviteField) inviteField.hidden = false;
        toggleRegister.textContent = "Já tem conta? Clique para entrar";
        if (submitBtn) submitBtn.textContent = "Criar Minha Conta";
      } else {
        registerFields.hidden = true;
        if (inviteField) inviteField.hidden = true;
        toggleRegister.textContent = "Não tem conta? Use um convite";
        if (submitBtn) submitBtn.textContent = "Entrar no Sistema";
      }
    });
  }

  const logoutBtnTop = document.querySelector("#logout-button-top");
  if (logoutBtnTop) {
    logoutBtnTop.addEventListener("click", async () => {
      if (!window.crecheFirebaseBridge) return;
      try {
        setLoading(true);
        await window.crecheFirebaseBridge.signOut();
        render();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });
  }

  const newRecordBtn = document.querySelector("#new-record-btn");
  if (newRecordBtn) {
    newRecordBtn.addEventListener("click", () => {
      state.editingId = null;
      renderForm();
      toggleSlideOver(true);
    });
  }

  const closeSlideOver = document.querySelector("#close-slide-over");
  if (closeSlideOver) {
    closeSlideOver.addEventListener("click", () => {
      toggleSlideOver(false);
    });
  }

  const backdrop = document.querySelector(".slide-over-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => {
      toggleSlideOver(false);
    });
  }
}

function render() {
  const role = getEffectiveRole();
  document.body.setAttribute("data-role", role);
  setFeedback("auth-feedback", "");
  
  // Try-catch individual para cada componente de interface
  try { renderAuthStatus(); } catch(e) { console.warn("Aguardando login:", e); }
  
  if (!window.crecheStore || !window.crecheStore.data) {
    return;
  }

  try { renderProfiles(); } catch(e) { console.warn("Perfis pendentes:", e); }
  try { renderNav(); } catch(e) { console.warn("Menu pendente:", e); }
  try { renderSyncStatus(); } catch(e) { console.warn("Status de sincronizacao:", e); }
  
  // Show/Hide Dashboard view vs Table view
  const isDashboard = state.currentModule === "dashboard" && !state.search && !state.editingId;
  
  const dashboardContainer = document.querySelector("#dashboard");
  const reportStrip = document.querySelector("#report-strip");
  const panelTable = document.querySelector(".panel-table");
  const quickActions = document.querySelector("#quick-actions");

  if (dashboardContainer) dashboardContainer.hidden = !isDashboard;
  if (reportStrip) reportStrip.hidden = !isDashboard;
  if (panelTable) panelTable.hidden = isDashboard;
  if (quickActions) quickActions.hidden = !isDashboard;

  // Always update header to ensure titles and breadcrumbs sync
  try { renderHeader(); } catch(e) { console.error("Erro no Header:", e); }

  if (isDashboard) {
    try { renderDashboard(window.crecheStore.data); } catch(e) { console.error("Erro no Dashboard:", e); }
    try { renderQuickActions(); } catch(e) { console.error("Erro nas Acoes Rapidas:", e); }
  } else {
    try { renderForm(); } catch(e) { console.error("Erro no Form:", e); }
    try { renderTable(); } catch(e) { console.error("Erro na Tabela:", e); }
  }
}

async function bootstrap() {
  if (state.isInitializing) return;
  state.isInitializing = true;

  try {
    console.log("Creche ERP: Iniciando interface...");
    attachToolbar(); // Ativa os botões primeiro para o login funcionar
    
    // Tenta carregar dados iniciais (Local ou Firebase se já logado)
    if (window.crecheStore) {
      const role = state.sync.role || "direcao";
      await window.crecheStore.init(rolePermissions[role]).catch(err => {
        console.warn("Aguardando login ou conexão para carregar dados completos.");
      });
    }
    
    render();
    console.log("Creche ERP: Pronto.");
  } catch (error) {
    console.error("Erro no bootstrap:", error);
    render(); 
  } finally {
    state.isInitializing = false;
  }
}

window.addEventListener("creche:firebase-ready", async (event) => {
  state.sync.enabled = Boolean(event.detail?.enabled);
  state.sync.reason = event.detail?.reason ?? null;
  if (state.sync.enabled) {
    const profile = await window.crecheFirebaseBridge.loadCurrentUserProfile();
    state.sync.role = profile?.role || "direcao";
    if (window.crecheStore) {
      await window.crecheStore.init(rolePermissions[state.sync.role]);
    }
    render();
  } else {
    renderSyncStatus();
  }
});

window.addEventListener("creche:firebase-status", (event) => {
  state.sync = {
    ...state.sync,
    ...event.detail
  };
  if (state.sync.role && window.crecheStore) {
    window.crecheStore.data.activeProfileId = state.sync.role;
  }
  if (state.sync.authenticated) {
    setFeedback("auth-feedback", "");
  }
  renderAuthStatus();
  renderSyncStatus();
});

bootstrap();
