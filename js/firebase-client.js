import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const config = window.CRECHE_FIREBASE;
const validRoles = ["direcao", "secretaria", "financeiro"];

function dispatchReady(detail) {
  window.dispatchEvent(new CustomEvent("creche:firebase-ready", { detail }));
}

function dispatchStatus(detail) {
  window.dispatchEvent(new CustomEvent("creche:firebase-status", { detail }));
}

function hasRequiredConfig() {
  return Boolean(config.enabled && config.apiKey && config.appId && config.projectId);
}

function schoolRoot(db) {
  return doc(db, config.schoolCollection, config.schoolDocument);
}

function moduleCollection(db, moduleKey) {
  return collection(schoolRoot(db), config.collections[moduleKey]);
}

function moduleDoc(db, moduleKey, id) {
  return doc(schoolRoot(db), config.collections[moduleKey], id);
}

function metaRef(db) {
  return doc(schoolRoot(db), config.metaCollection, config.metaDocument);
}

function userRef(db, uid) {
  return moduleDoc(db, "users", uid);
}

function inviteRef(db, code) {
  return moduleDoc(db, "invites", code);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function replaceCollection(db, moduleKey, rows) {
  const moduleRef = moduleCollection(db, moduleKey);
  const snapshot = await getDocs(moduleRef);
  const batch = writeBatch(db);

  snapshot.forEach((item) => {
    batch.delete(item.ref);
  });

  rows.forEach((row) => {
    batch.set(doc(moduleRef, row.id), row);
  });

  await batch.commit();
}

if (!hasRequiredConfig()) {
  dispatchReady({ enabled: false, reason: "missing-config" });
} else {
  try {
    const app = initializeApp({
      apiKey: config.apiKey,
      appId: config.appId,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId
    });

    const auth = getAuth(app);
    const db = getFirestore(app);

    window.crecheFirebaseBridge = {
      isAuthenticated() {
        return Boolean(auth.currentUser);
      },

      async ensureUserProfile(user) {
        const snapshot = await getDoc(userRef(db, user.uid));
        return snapshot.exists() ? snapshot.data() : null;
      },

      async signIn(email, password) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return this.ensureUserProfile(credential.user);
      },

      async register(nome, email, password, role, inviteCode) {
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const rawPassword = String(password || "");
        const rawNome = String(nome || "").trim();

        if (!normalizedEmail || rawPassword.length < 6 || !rawNome) {
          throw new Error("Nome, E-mail e Senha (min. 6 caracteres) sao obrigatorios.");
        }

        let credential;
        try {
          credential = await createUserWithEmailAndPassword(auth, normalizedEmail, rawPassword);
        } catch (authError) {
          // Se for o admin e a conta já existir, tentamos logar para completar o bootstrap
          if (authError.code === "auth/email-already-in-use" && normalizedEmail === normalizeEmail(config.bootstrapAdminEmail)) {
            try {
              credential = await signInWithEmailAndPassword(auth, normalizedEmail, rawPassword);
            } catch (signInError) {
              // Se falhou no login de recuperação (ex: senha errada), lançamos o erro original mais descritivo
              throw new Error("A conta de administrador ja existe, mas a senha fornecida esta incorreta.");
            }
          } else {
            throw authError;
          }
        }

        const uid = credential.user.uid;

        try {
          const metaSnapshot = await getDoc(metaRef(db));
          const meta = metaSnapshot.exists() ? metaSnapshot.data() : {};
          const isBootstrapAdmin = normalizedEmail === normalizeEmail(config.bootstrapAdminEmail);
          
          const bootstrapAllowed =
            meta.bootstrapCompleted !== true
            && isBootstrapAdmin;

          let role = null;

          if (bootstrapAllowed || isBootstrapAdmin) {
            role = "direcao";
          } else {
            const code = String(inviteCode || "").trim();
            if (!code) {
              throw new Error("O codigo de convite e obrigatorio para realizar o cadastro.");
            }
            const inviteSnapshot = await getDoc(inviteRef(db, code));
            if (!inviteSnapshot.exists()) {
              throw new Error("Convite nao encontrado para este codigo.");
            }
            const invite = inviteSnapshot.data();
            const validInvite =
              invite.status === "Ativo"
              && normalizeEmail(invite.email) === normalizedEmail
              && validRoles.includes(invite.role);
            if (!validInvite) {
              throw new Error("Convite invalido ou ja utilizado para este e-mail.");
            }
            role = invite.role;
            await updateDoc(inviteRef(db, code), {
              status: "Utilizado",
              consumedBy: uid,
              consumedAt: new Date().toISOString()
            });
          }

          // Se for bootstrap ou email de admin, forçamos direcao. 
          // Caso contrário, tentamos usar o role passado no argumento (se enviado), ou o role do convite.
          const finalRole = (isBootstrapAdmin || bootstrapAllowed) ? "direcao" : (role || "secretaria");

          // Objeto do perfil que acabamos de salvar
          const profile = {
            id: uid,
            email: normalizedEmail,
            nome: rawNome,
            role: finalRole,
            status: "Ativo",
            inviteCode: String(inviteCode || "").trim() || null,
            updatedAt: new Date().toISOString(),
            createdAt: meta.bootstrapCompleted ? (meta.createdAt || new Date().toISOString()) : new Date().toISOString()
          };

          // Garante ou atualiza o perfil do usuario no Firestore
          await setDoc(userRef(db, uid), profile, { merge: true });

          if (bootstrapAllowed) {
            await setDoc(metaRef(db), {
              bootstrapCompleted: true,
              activeProfileId: "direcao",
              projectId: config.projectId,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
          
          return profile;
        } catch (error) {
          // Removido cleanup agressivo para estabilizar fluxo
          throw error;
        }
      },

      async signOut() {
        await signOut(auth);
      },

      async issueInvite(email, role, code) {
        const normalizedEmail = normalizeEmail(email);
        const normalizedCode = String(code || "").trim();
        if (!normalizedEmail || !normalizedCode || !validRoles.includes(role)) {
          throw new Error("Dados do convite invalidos.");
        }
        await setDoc(inviteRef(db, normalizedCode), {
          id: normalizedCode,
          code: normalizedCode,
          email: normalizedEmail,
          role,
          status: "Ativo",
          createdBy: auth.currentUser?.uid || null,
          createdAt: new Date().toISOString()
        }, { merge: true });
      },

      async revokeInvite(code) {
        const normalizedCode = String(code || "").trim();
        await updateDoc(inviteRef(db, normalizedCode), {
          status: "Cancelado",
          revokedBy: auth.currentUser?.uid || null,
          revokedAt: new Date().toISOString()
        });
      },

      async assignUserRole(uid, role) {
        if (!validRoles.includes(role)) {
          throw new Error("Perfil invalido.");
        }
        await updateDoc(userRef(db, uid), {
          role,
          updatedAt: new Date().toISOString(),
          updatedBy: auth.currentUser?.uid || null
        });
      },

      async loadCurrentUserProfile() {
        if (!auth.currentUser) return null;
        return this.ensureUserProfile(auth.currentUser);
      },

      async load(allowedModules = null) {
        if (!auth.currentUser) return null;
        const data = {};
        const pool = allowedModules ? allowedModules : Object.keys(config.collections);
        
        for (const moduleKey of pool) {
          try {
            const snapshot = await getDocs(moduleCollection(db, moduleKey));
            data[moduleKey] = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
          } catch (error) {
            console.warn(`Firestore permission denied for module: ${moduleKey}`, error);
            data[moduleKey] = []; // Fallback gracefully
          }
        }

        try {
          const metaSnapshot = await getDoc(metaRef(db));
          if (metaSnapshot.exists()) {
            const meta = metaSnapshot.data();
            data.activeProfileId = meta.activeProfileId ?? "direcao";
          } else {
            data.activeProfileId = "direcao";
          }
        } catch (error) {
          console.warn("Firestore error reading meta document:", error);
          data.activeProfileId = "direcao";
        }

        return data;
      },

      async save(data) {
        if (!auth.currentUser) {
          throw new Error("Usuario nao autenticado.");
        }

        for (const moduleKey of Object.keys(config.collections)) {
          try {
            const rows = Array.isArray(data[moduleKey]) ? data[moduleKey] : [];
            await replaceCollection(db, moduleKey, rows);
          } catch (error) {
            console.warn(`Firestore permission denied for module save: ${moduleKey}`, error);
          }
        }

        try {
          await setDoc(metaRef(db), {
            activeProfileId: data.activeProfileId ?? "direcao",
            bootstrapCompleted: true,
            projectId: config.projectId,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.warn("Firestore error saving meta document:", error);
        }

        return data;
      },

      async deleteDocument(moduleKey, id) {
        if (!auth.currentUser) {
          throw new Error("Usuario nao autenticado.");
        }
        await deleteDoc(moduleDoc(db, moduleKey, id));
      }
    };

    let registrationCache = null;
    const registerOrig = window.crecheFirebaseBridge.register;
    window.crecheFirebaseBridge.register = async (...args) => {
      const profile = await registerOrig.apply(window.crecheFirebaseBridge, args);
      registrationCache = profile;
      // Limpa cache após 5 segundos, tempo de sobra para o Firestore sincronizar
      setTimeout(() => { registrationCache = null; }, 5000);
      return profile;
    };

    onAuthStateChanged(auth, async (user) => {
      let profile = null;
      if (user) {
        // Se temos perfil no cache de registro recente, usamos ele primeiro para evitar race condition
        if (registrationCache && registrationCache.id === user.uid) {
          profile = registrationCache;
        } else {
          profile = await window.crecheFirebaseBridge.loadCurrentUserProfile();
        }
      }
      
      dispatchStatus({
        enabled: true,
        authenticated: Boolean(user),
        uid: user?.uid ?? null,
        email: user?.email ?? profile?.email ?? null,
        nome: profile?.nome ?? null,
        role: profile?.role ?? null
      });
    });

    dispatchReady({ enabled: true });
  } catch (error) {
    dispatchReady({
      enabled: false,
      reason: "init-error",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
