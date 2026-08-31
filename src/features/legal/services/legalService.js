// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminLegalController.cs.
// This controller had NO service and NO screen anywhere in the admin app —
// legal documents (Privacy Policy / Terms of Service) could not be managed,
// and user consent records could not be reviewed, from the UI at all.
//
//   GET    /api/admin/legal-documents            -> documentService.getDocuments(params)
//   GET    /api/admin/legal-documents/{id}         -> documentService.getDocumentById(id)
//   POST   /api/admin/legal-documents              -> documentService.createDocument(payload)
//   PUT    /api/admin/legal-documents/{id}          -> documentService.updateDocument(id, payload)
//   DELETE /api/admin/legal-documents/{id}          -> documentService.deleteDocument(id)
//   POST   /api/admin/legal-documents/{id}/publish  -> documentService.publish(id)
//
//   GET    /api/admin/user-consents               -> consentService.getConsents(params)   (read-only)
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const documentService = {
  /** GET /api/admin/legal-documents — AdminLegalDocumentListRequest */
  getDocuments(params = {}) {
    const { page = 1, pageSize = 20, type, language, isActive } = params;
    return apiClient.get(`/api/admin/legal-documents${buildQuery({ page, pageSize, type, language, isActive })}`);
  },

  /** GET /api/admin/legal-documents/{id} */
  getDocumentById(id) {
    return apiClient.get(`/api/admin/legal-documents/${id}`);
  },

  /** POST /api/admin/legal-documents — AdminUpsertLegalDocumentRequest */
  createDocument(payload) {
    return apiClient.post(`/api/admin/legal-documents`, payload);
  },

  /** PUT /api/admin/legal-documents/{id} — AdminUpsertLegalDocumentRequest */
  updateDocument(id, payload) {
    return apiClient.put(`/api/admin/legal-documents/${id}`, payload);
  },

  /** DELETE /api/admin/legal-documents/{id} */
  deleteDocument(id) {
    return apiClient.delete(`/api/admin/legal-documents/${id}`);
  },

  /** POST /api/admin/legal-documents/{id}/publish — deactivates other docs of the same type+language */
  publish(id) {
    return apiClient.post(`/api/admin/legal-documents/${id}/publish`);
  },
};

export const consentService = {
  /** GET /api/admin/user-consents — AdminUserConsentListRequest (fully read-only, cannot be edited/removed) */
  getConsents(params = {}) {
    const { page = 1, pageSize = 20, userId, documentId, accepted } = params;
    return apiClient.get(`/api/admin/user-consents${buildQuery({ page, pageSize, userId, documentId, accepted })}`);
  },
};

// MerfitApi.Domain.Entities.Enums.LegalDocumentType — enum ordinal order
// matters (see constants/apiEnums.js note re: default System.Text.Json
// integer serialization for request-side enum fields).
export const LEGAL_DOCUMENT_TYPE = ["PrivacyPolicy", "TermsOfService"];
