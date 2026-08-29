// Mock implementations of AdminLanguageController and
// AdminTranslationController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminLanguageController.cs,
// AdminTranslationController.cs).
import { languagesMockData, translationsMockData, ALL_RESOURCE_KEYS } from "../data/translationsMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let languages = [...languagesMockData];
let translations = [...translationsMockData];

function translationCount(languageId) {
  return translations.filter((t) => t.languageId === languageId).length;
}

export const languageService = {
  /** GET /api/admin/languages */
  getLanguages(params = {}) {
    const { page = 1, pageSize = 50 } = params;
    const withCounts = languages.map((l) => ({ ...l, translationCount: translationCount(l.id) }));
    const result = queryRows(withCounts, {
      filters: { isActive: params.isActive },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },
  /** POST /api/admin/languages — AdminUpsertLanguageRequest */
  createLanguage(payload) {
    if (payload.isDefault) {
      languages = languages.map((l) => ({ ...l, isDefault: false }));
    }
    const newLanguage = {
      id: Math.max(0, ...languages.map((l) => l.id)) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    languages = [...languages, newLanguage];
    return simulateLatency(apiSuccess({ ...newLanguage, translationCount: 0 }), 250);
  },
  updateLanguage(id, payload) {
    if (payload.isDefault) {
      languages = languages.map((l) => ({ ...l, isDefault: l.id === Number(id) }));
    }
    languages = languages.map((l) =>
      l.id === Number(id) ? { ...l, ...payload, updatedAt: new Date().toISOString() } : l,
    );
    const updated = languages.find((l) => l.id === Number(id));
    return simulateLatency(apiSuccess({ ...updated, translationCount: translationCount(updated.id) }), 250);
  },
  deleteLanguage(id) {
    languages = languages.filter((l) => l.id !== Number(id));
    translations = translations.filter((t) => t.languageId !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
};

export const translationService = {
  /** GET /api/admin/translations — AdminTranslationListRequest */
  getTranslations(params = {}) {
    const { page = 1, pageSize = 1000 } = params;
    const result = queryRows(translations, {
      search: params.resourceKey,
      searchFields: ["resourceKey"],
      filters: { languageId: params.languageId },
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  /** POST /api/admin/translations — AdminUpsertTranslationRequest */
  createTranslation(payload) {
    const language = languages.find((l) => l.id === payload.languageId);
    const newTranslation = {
      id: Math.max(0, ...translations.map((t) => t.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
      languageCode: language?.code ?? "",
    };
    translations = [...translations, newTranslation];
    return simulateLatency(apiSuccess(newTranslation), 200);
  },

  /** PUT /api/admin/translations/{id} */
  updateTranslation(id, payload) {
    translations = translations.map((t) =>
      t.id === Number(id) ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t,
    );
    return simulateLatency(apiSuccess(translations.find((t) => t.id === Number(id))), 200);
  },

  deleteTranslation(id) {
    translations = translations.filter((t) => t.id !== Number(id));
    return simulateLatency(apiSuccess(null), 150);
  },

  /** PUT /api/admin/translations/bulk — AdminBulkUpdateTranslationsRequest (upsert by languageId+resourceKey) */
  bulkUpdate(items) {
    let createdCount = 0;
    let updatedCount = 0;
    items.forEach(({ languageId, resourceKey, value }) => {
      const language = languages.find((l) => l.id === languageId);
      const existing = translations.find((t) => t.languageId === languageId && t.resourceKey === resourceKey);
      if (existing) {
        translations = translations.map((t) =>
          t.id === existing.id ? { ...t, value, updatedAt: new Date().toISOString() } : t,
        );
        updatedCount += 1;
      } else {
        translations = [
          ...translations,
          {
            id: Math.max(0, ...translations.map((t) => t.id)) + 1,
            languageId,
            languageCode: language?.code ?? "",
            resourceKey,
            value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        createdCount += 1;
      }
    });
    return simulateLatency(apiSuccess({ createdCount, updatedCount }), 400);
  },

  /** POST /api/admin/translations/import — single-language bulk upsert */
  importForLanguage(languageId, items) {
    return this.bulkUpdate(items.map((i) => ({ languageId, ...i })));
  },
};

export function getAllResourceKeys() {
  return ALL_RESOURCE_KEYS;
}
