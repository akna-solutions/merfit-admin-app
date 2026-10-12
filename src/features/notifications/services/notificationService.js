// MerfitApi admin bildirim uc noktalari (http://localhost:5000, bkz. MerfitApi repo):
//   AdminNotificationController           /api/admin/notifications              (uygulama ici kutu gecmisi)
//   AdminNotificationTemplateController   /api/admin/notification-templates
//   AdminNotificationRuleController       /api/admin/notification-rules
//   AdminNotificationCampaignController   /api/admin/notification-campaigns
//   AdminNotificationDispatchController   /api/admin/notification-dispatches
//   AdminMonthlyRewardNotificationController /api/admin/notification-monthly-runs
// Push gonderimi istek icinde yapilmaz: kampanya zamanlanir, arka plan islemleri kuyruga yazar ve
// MerfitCustomerApi gonderir. Cihaz tokenlari hicbir yanitta yer almaz.
import { apiClient, buildQuery } from "../../../utils/apiClient";

function dateRangeParams(dateRange) {
  const [from, to] = dateRange ?? [];
  return {
    from: from ? from.toISOString?.() ?? from : undefined,
    to: to ? to.toISOString?.() ?? to : undefined,
  };
}

/** Uygulama ici bildirim kutusu gecmisi. */
export const notificationService = {
  getNotifications(params = {}) {
    const { page = 1, pageSize = 20, search, userId, isRead, type, dateRange } = params;
    return apiClient.get(
      `/api/admin/notifications${buildQuery({ page, pageSize, search, userId, isRead, type, ...dateRangeParams(dateRange) })}`,
    );
  },
  getNotificationById(id) {
    return apiClient.get(`/api/admin/notifications/${id}`);
  },
  deleteNotification(id) {
    return apiClient.delete(`/api/admin/notifications/${id}`);
  },
};

let metadataPromise = null;

export const notificationTemplateService = {
  /** Turler, segmentler, ekranlar, ture gore alanlar, buyuk kitle esigi. Oturum boyunca onbellekte tutulur. */
  getMetadata() {
    if (!metadataPromise) {
      metadataPromise = apiClient.get(`/api/admin/notification-templates/metadata`).catch((error) => {
        metadataPromise = null;
        throw error;
      });
    }
    return metadataPromise;
  },
  getTemplates(params = {}) {
    const { page = 1, pageSize = 20, search, type, isActive } = params;
    return apiClient.get(`/api/admin/notification-templates${buildQuery({ page, pageSize, search, type, isActive })}`);
  },
  createTemplate(payload) {
    return apiClient.post(`/api/admin/notification-templates`, payload);
  },
  updateTemplate(id, payload) {
    return apiClient.put(`/api/admin/notification-templates/${id}`, payload);
  },
  deleteTemplate(id) {
    return apiClient.delete(`/api/admin/notification-templates/${id}`);
  },
  /** Hicbir sey gondermez; metni ornek degerlerle doldurur. */
  preview(payload) {
    return apiClient.post(`/api/admin/notification-templates/preview`, payload);
  },
};

export const notificationRuleService = {
  getRules(params = {}) {
    const { page = 1, pageSize = 20, search, kind, status } = params;
    return apiClient.get(`/api/admin/notification-rules${buildQuery({ page, pageSize, search, kind, status })}`);
  },
  createRule(payload) {
    return apiClient.post(`/api/admin/notification-rules`, payload);
  },
  updateRule(id, payload) {
    return apiClient.put(`/api/admin/notification-rules/${id}`, payload);
  },
  changeStatus(id, status) {
    return apiClient.patch(`/api/admin/notification-rules/${id}/status`, { status });
  },
  deleteRule(id) {
    return apiClient.delete(`/api/admin/notification-rules/${id}`);
  },
};

export const notificationCampaignService = {
  getCampaigns(params = {}) {
    const { page = 1, pageSize = 20, search, status } = params;
    return apiClient.get(`/api/admin/notification-campaigns${buildQuery({ page, pageSize, search, status })}`);
  },
  getCampaign(id) {
    return apiClient.get(`/api/admin/notification-campaigns/${id}`);
  },
  /** Kaydetmeden kitle sayisi ve ornek alicilar: { segment, userIds? } */
  previewAudience(payload) {
    return apiClient.post(`/api/admin/notification-campaigns/audience-preview`, payload);
  },
  getAudience(id) {
    return apiClient.get(`/api/admin/notification-campaigns/${id}/audience`);
  },
  createCampaign(payload) {
    return apiClient.post(`/api/admin/notification-campaigns`, payload);
  },
  updateCampaign(id, payload) {
    return apiClient.put(`/api/admin/notification-campaigns/${id}`, payload);
  },
  deleteCampaign(id) {
    return apiClient.delete(`/api/admin/notification-campaigns/${id}`);
  },
  /** { scheduledAtUtc, confirmLargeAudience } */
  schedule(id, payload) {
    return apiClient.post(`/api/admin/notification-campaigns/${id}/schedule`, payload);
  },
  /** { confirmLargeAudience } */
  sendNow(id, payload) {
    return apiClient.post(`/api/admin/notification-campaigns/${id}/send-now`, payload);
  },
  unschedule(id) {
    return apiClient.post(`/api/admin/notification-campaigns/${id}/unschedule`);
  },
  cancel(id) {
    return apiClient.post(`/api/admin/notification-campaigns/${id}/cancel`);
  },
  getStats(id) {
    return apiClient.get(`/api/admin/notification-campaigns/${id}/stats`);
  },
  retryFailed(id) {
    return apiClient.post(`/api/admin/notification-campaigns/${id}/retry-failed`);
  },
};

export const notificationDispatchService = {
  /** Filtreler: status, source, campaignId, ruleId, leaderboardPeriodId, userId, search (e-posta), dateRange */
  getDispatches(params = {}) {
    const { page = 1, pageSize = 20, dateRange, ...rest } = params;
    return apiClient.get(`/api/admin/notification-dispatches${buildQuery({ page, pageSize, ...rest, ...dateRangeParams(dateRange) })}`);
  },
  getDispatch(id) {
    return apiClient.get(`/api/admin/notification-dispatches/${id}`);
  },
  retry(id) {
    return apiClient.post(`/api/admin/notification-dispatches/${id}/retry`);
  },
};

export const monthlyRewardNotificationService = {
  getRuns(params = {}) {
    const { page = 1, pageSize = 20, status } = params;
    return apiClient.get(`/api/admin/notification-monthly-runs${buildQuery({ page, pageSize, status })}`);
  },
  /** Kuyruga al veya yeniden dene (donem bitmeden calismaz, ayni kullaniciya iki kez gonderilmez). */
  trigger(periodId) {
    return apiClient.post(`/api/admin/notification-monthly-runs/periods/${periodId}/trigger`);
  },
};
