// Real MBFitApi calls (see MBFitApi repo, running at http://localhost:5000):
// MBFitApi.Api/Controllers/Admin/AdminLanguageController.cs and
// AdminTranslationController.cs.
import { apiClient, buildQuery } from "../../../utils/apiClient";
import { ALL_RESOURCE_KEYS } from "../data/translationsMockData";

export const languageService = {
  /** GET /api/admin/languages — AdminLanguageListRequest */
  getLanguages(params = {}) {
    const { page = 1, pageSize = 50, isActive } = params;
    return apiClient.get(`/api/admin/languages${buildQuery({ page, pageSize, isActive })}`);
  },
  /** GET /api/admin/languages/{id} */
  getLanguageById(id) {
    return apiClient.get(`/api/admin/languages/${id}`);
  },
  /** POST /api/admin/languages — AdminUpsertLanguageRequest */
  createLanguage(payload) {
    return apiClient.post(`/api/admin/languages`, payload);
  },
  /** PUT /api/admin/languages/{id} — AdminUpsertLanguageRequest */
  updateLanguage(id, payload) {
    return apiClient.put(`/api/admin/languages/${id}`, payload);
  },
  /** DELETE /api/admin/languages/{id} */
  deleteLanguage(id) {
    return apiClient.delete(`/api/admin/languages/${id}`);
  },
};

export const translationService = {
  /** GET /api/admin/translations — AdminTranslationListRequest */
  getTranslations(params = {}) {
    const { page = 1, pageSize = 1000, languageId, resourceKey } = params;
    return apiClient.get(
      `/api/admin/translations${buildQuery({ page, pageSize, languageId, resourceKey })}`,
    );
  },

  /** GET /api/admin/translations/{id} */
  getTranslationById(id) {
    return apiClient.get(`/api/admin/translations/${id}`);
  },

  /** POST /api/admin/translations — AdminUpsertTranslationRequest */
  createTranslation(payload) {
    return apiClient.post(`/api/admin/translations`, payload);
  },

  /** PUT /api/admin/translations/{id} — AdminUpsertTranslationRequest */
  updateTranslation(id, payload) {
    return apiClient.put(`/api/admin/translations/${id}`, payload);
  },

  /** DELETE /api/admin/translations/{id} */
  deleteTranslation(id) {
    return apiClient.delete(`/api/admin/translations/${id}`);
  },

  /** PUT /api/admin/translations/bulk — AdminBulkUpdateTranslationsRequest { items: AdminUpsertTranslationRequest[] } */
  bulkUpdate(items) {
    return apiClient.put(`/api/admin/translations/bulk`, { items });
  },

  /** POST /api/admin/translations/import — AdminImportTranslationsRequest { languageId, items: [{ resourceKey, value }] } */
  importForLanguage(languageId, items) {
    return apiClient.post(`/api/admin/translations/import`, { languageId, items });
  },
};

export function getAllResourceKeys() {
  return ALL_RESOURCE_KEYS;
}
