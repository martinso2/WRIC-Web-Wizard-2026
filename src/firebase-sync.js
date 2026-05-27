(function () {
  const RESPONSE_ID_KEY = "nonprofit-workbook-response-id";
  const RESPONSE_CREATED_KEY = "nonprofit-workbook-response-created-at";

  const firebaseConfig = {
    apiKey: "AIzaSyCI2mKojnihiQtK9WFAJ3DSchtHVs_HmNY",
    authDomain: "wric-wizard-2026.firebaseapp.com",
    databaseURL: "https://wric-wizard-2026-default-rtdb.firebaseio.com",
    projectId: "wric-wizard-2026",
    storageBucket: "wric-wizard-2026.firebasestorage.app",
    messagingSenderId: "799136493613",
    appId: "1:799136493613:web:b174dfb9b065225be6c8a4",
    measurementId: "G-FN67KWNFZC",
  };

  const makeId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `response-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  };

  const getResponseId = () => {
    let id = localStorage.getItem(RESPONSE_ID_KEY);
    if (!id) {
      id = makeId();
      localStorage.setItem(RESPONSE_ID_KEY, id);
      localStorage.setItem(RESPONSE_CREATED_KEY, new Date().toISOString());
    }
    return id;
  };

  const resetResponseId = () => {
    localStorage.removeItem(RESPONSE_ID_KEY);
    localStorage.removeItem(RESPONSE_CREATED_KEY);
  };

  const sanitizeAnswers = (answers) => {
    const privateKeys = new Set([
      "respondent_email",
      "respondent_name",
      "respondent_role",
    ]);
    return Object.keys(answers || {}).reduce((publicAnswers, key) => {
      if (!privateKeys.has(key)) {
        publicAnswers[key] = answers[key];
      }
      return publicAnswers;
    }, {});
  };

  if (!window.firebase || !window.firebase.database || !window.firebase.auth) {
    console.warn("Firebase SDK not loaded; remote workbook sync is disabled.");
    window.WorkbookFirebase = { getResponseId, resetResponseId, save: () => Promise.resolve(false) };
    return;
  }

  const app = window.firebase.apps.length
    ? window.firebase.app()
    : window.firebase.initializeApp(firebaseConfig);
  const database = app.database();
  const auth = app.auth();
  const authReady = new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        auth.signInAnonymously().catch(reject);
      }
    }, reject);
  });

  const save = async (answers) => {
    if (!answers || Object.keys(answers).length === 0) {
      return Promise.resolve(false);
    }

    const user = await authReady;
    const responseId = getResponseId();
    const createdAt = localStorage.getItem(RESPONSE_CREATED_KEY) || new Date().toISOString();
    localStorage.setItem(RESPONSE_CREATED_KEY, createdAt);

    const updatedAt = new Date().toISOString();
    const privateRecord = {
      answers,
      createdAt,
      respondentEmail: answers.respondent_email || "",
      respondentName: answers.respondent_name || "",
      respondentRole: answers.respondent_role || "",
      responseId,
      updatedAt,
      url: window.location.href,
      uid: user.uid,
      userAgent: window.navigator.userAgent,
    };
    const publicRecord = {
      answers: sanitizeAnswers(answers),
      createdAt,
      responseId,
      updatedAt,
    };

    return database.ref().update({
      [`workbookResponses/${user.uid}/${responseId}`]: privateRecord,
      [`publicResponseSummaries/${user.uid}/${responseId}`]: publicRecord,
    });
  };

  const getPublicSummaries = async () => {
    const snapshot = await database.ref("publicResponseSummaries").once("value");
    const summaries = [];
    const byUser = snapshot.val() || {};
    Object.keys(byUser).forEach((uid) => {
      const responses = byUser[uid] || {};
      Object.keys(responses).forEach((responseId) => {
        summaries.push({
          responseId,
          ...(responses[responseId] || {}),
        });
      });
    });
    return summaries;
  };

  window.WorkbookFirebase = {
    auth,
    database,
    getPublicSummaries,
    getResponseId,
    resetResponseId,
    save,
  };
})();
