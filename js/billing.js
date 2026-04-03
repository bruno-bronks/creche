/**
 * Creche ERP - Billing Engine v3.0
 * Handles batch generation of student tuitions.
 */

window.crecheBilling = {
  /**
   * Generates tuitions for all active students for a given month.
   * @param {string} reference - Format "YYYY-MM"
   */
  async generateMonthlyBatch(reference) {
    const students = window.crecheStore.data.students.filter(s => s.status === "Ativo");
    const existingTuitions = window.crecheStore.data.tuition;
    
    let createdCount = 0;
    let skippedCount = 0;

    for (const student of students) {
      // Check if tuition already exists for this student and reference
      const alreadyExists = existingTuitions.find(t => 
        t.aluno === student.nome && t.referencia === reference
      );

      if (alreadyExists) {
        skippedCount++;
        continue;
      }

      // Prepare payload
      const payload = {
        aluno: student.nome,
        referencia: reference,
        valor: Number(student.valorMensalidade || 0),
        vencimento: `${reference}-10`, // Default to day 10
        formaPagamento: "Pix",
        status: "Em aberto"
      };

      await window.crecheStore.create("tuition", payload);
      createdCount++;
    }

    // Refresh data with current permissions
    const currentRole = window.crecheStore.data.activeProfileId || "direcao";
    await window.crecheStore.init(null); // Refreshes all data
    
    return { createdCount, skippedCount };
  }
};
