const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params");

initializeApp();

const db = getFirestore();

const SCHOOL_ID = defineString("SCHOOL_ID", {
  default: "creche-5900b"
});

const BOOTSTRAP_ADMIN_EMAIL = defineString("BOOTSTRAP_ADMIN_EMAIL");

function schoolRef() {
  return db.collection("schools").doc(SCHOOL_ID.value());
}

function ensureAuthenticated(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuario nao autenticado.");
  }
}

async function getRole(uid) {
  const snapshot = await schoolRef().collection("users").doc(uid).get();
  if (!snapshot.exists) return null;
  return snapshot.data().role || null;
}

function ensureRole(role, ...allowed) {
  if (!allowed.includes(role)) {
    throw new HttpsError("permission-denied", "Usuario sem permissao.");
  }
}

exports.bootstrapAdmin = onCall(async (request) => {
  ensureAuthenticated(request);

  const authUser = await getAuth().getUser(request.auth.uid);
  const email = String(authUser.email || "").toLowerCase();
  const expected = String(BOOTSTRAP_ADMIN_EMAIL.value() || "").toLowerCase();

  if (!expected || email !== expected) {
    throw new HttpsError("permission-denied", "Bootstrap nao autorizado para este e-mail.");
  }

  const metaRef = schoolRef().collection("system").doc("meta");
  const metaSnapshot = await metaRef.get();
  if (metaSnapshot.exists && metaSnapshot.data().bootstrapCompleted === true) {
    throw new HttpsError("failed-precondition", "Bootstrap ja executado.");
  }

  await schoolRef().collection("users").doc(request.auth.uid).set({
    id: request.auth.uid,
    email,
    role: "direcao",
    status: "Ativo",
    createdAt: FieldValue.serverTimestamp()
  }, { merge: true });

  await metaRef.set({
    bootstrapCompleted: true,
    activeProfileId: "direcao",
    projectId: SCHOOL_ID.value(),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return { ok: true, role: "direcao" };
});

exports.issueInvite = onCall(async (request) => {
  ensureAuthenticated(request);
  const role = await getRole(request.auth.uid);
  ensureRole(role, "direcao");

  const email = String(request.data?.email || "").trim().toLowerCase();
  const inviteRole = String(request.data?.role || "");
  const code = String(request.data?.code || "").trim();

  if (!email || !code || !["direcao", "secretaria", "financeiro"].includes(inviteRole)) {
    throw new HttpsError("invalid-argument", "Dados do convite invalidos.");
  }

  await schoolRef().collection("invites").doc(code).set({
    id: code,
    code,
    email,
    role: inviteRole,
    status: "Ativo",
    createdBy: request.auth.uid,
    createdAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return { ok: true, code };
});

exports.consumeInvite = onCall(async (request) => {
  ensureAuthenticated(request);

  const authUser = await getAuth().getUser(request.auth.uid);
  const email = String(authUser.email || "").trim().toLowerCase();
  const code = String(request.data?.code || "").trim();

  if (!code) {
    throw new HttpsError("invalid-argument", "Codigo do convite obrigatorio.");
  }

  const inviteRef = schoolRef().collection("invites").doc(code);
  const inviteSnapshot = await inviteRef.get();
  if (!inviteSnapshot.exists) {
    throw new HttpsError("not-found", "Convite nao encontrado.");
  }

  const invite = inviteSnapshot.data();
  if (invite.status !== "Ativo" || invite.email !== email) {
    throw new HttpsError("permission-denied", "Convite invalido para este usuario.");
  }

  await schoolRef().collection("users").doc(request.auth.uid).set({
    id: request.auth.uid,
    email,
    role: invite.role,
    status: "Ativo",
    inviteCode: code,
    createdAt: FieldValue.serverTimestamp()
  }, { merge: true });

  await inviteRef.set({
    status: "Utilizado",
    consumedBy: request.auth.uid,
    consumedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return { ok: true, role: invite.role };
});

exports.revokeInvite = onCall(async (request) => {
  ensureAuthenticated(request);
  const role = await getRole(request.auth.uid);
  ensureRole(role, "direcao");

  const code = String(request.data?.code || "").trim();
  if (!code) {
    throw new HttpsError("invalid-argument", "Codigo do convite obrigatorio.");
  }

  await schoolRef().collection("invites").doc(code).set({
    status: "Cancelado",
    revokedBy: request.auth.uid,
    revokedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return { ok: true, code };
});

exports.assignUserRole = onCall(async (request) => {
  ensureAuthenticated(request);
  const role = await getRole(request.auth.uid);
  ensureRole(role, "direcao");

  const uid = String(request.data?.uid || "").trim();
  const nextRole = String(request.data?.role || "").trim();

  if (!uid || !["direcao", "secretaria", "financeiro"].includes(nextRole)) {
    throw new HttpsError("invalid-argument", "Dados de perfil invalidos.");
  }

  await schoolRef().collection("users").doc(uid).set({
    role: nextRole,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: request.auth.uid
  }, { merge: true });

  return { ok: true, uid, role: nextRole };
});
