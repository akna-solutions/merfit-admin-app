// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminNotificationController.cs
//
//   GET    /api/admin/notifications           -> getNotifications(params)
//   GET    /api/admin/notifications/{id}       -> getNotificationById(id)
//   POST   /api/admin/notifications/user       -> sendToUser(payload)
//   POST   /api/admin/notifications/broadcast  -> broadcast(payload)
//   POST   /api/admin/notifications/segment    -> sendToSegment(payload)
//   DELETE /api/admin/notifications/{id}       -> deleteNotification(id)
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const notificationService = {
  /** GET /api/admin/notifications — AdminNotificationListRequest */
  getNotifications(params = {}) {
    const { page = 1, pageSize = 20, search, userId, isRead, dateRange } = params;
    const [from, to] = dateRange ?? [];
    return apiClient.get(
      `/api/admin/notifications${buildQuery({ page, pageSize, search, userId, isRead, from, to })}`,
    );
  },

  /** GET /api/admin/notifications/{id} */
  getNotificationById(id) {
    return apiClient.get(`/api/admin/notifications/${id}`);
  },

  /** POST /api/admin/notifications/user — AdminSendUserNotificationRequest */
  sendToUser(payload) {
    return apiClient.post(`/api/admin/notifications/user`, payload);
  },

  /** POST /api/admin/notifications/broadcast — AdminBroadcastNotificationRequest */
  broadcast(payload) {
    return apiClient.post(`/api/admin/notifications/broadcast`, payload);
  },

  /** POST /api/admin/notifications/segment — AdminSegmentNotificationRequest { segment, title, body, imageUrl?, dataJson?, expiresAt? } */
  sendToSegment(payload) {
    return apiClient.post(`/api/admin/notifications/segment`, payload);
  },

  /** DELETE /api/admin/notifications/{id} */
  deleteNotification(id) {
    return apiClient.delete(`/api/admin/notifications/${id}`);
  },
};

// AdminNotificationSegment enum (see MerfitApi repo:
// MerfitApi.Business.Dtos.Admin.Notifications.AdminNotificationSegment).
export const NOTIFICATION_SEGMENTS = [
  { value: "AllUsers", label: "All Users" },
  { value: "PlusUsers", label: "Plus Users" },
  { value: "FreeUsers", label: "Free Users" },
  { value: "InactiveUsers", label: "Inactive Users" },
  { value: "NewUsers", label: "New Users" },
  { value: "WorkoutInactiveUsers", label: "Workout Inactive Users" },
];
