// Mock implementation of AdminNotificationController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminNotificationController.cs).
//
//   GET    /api/admin/notifications           -> getNotifications(params)
//   GET    /api/admin/notifications/{id}       -> getNotificationById(id)
//   POST   /api/admin/notifications/user       -> sendToUser(payload)
//   POST   /api/admin/notifications/broadcast  -> broadcast(payload)
//   POST   /api/admin/notifications/segment    -> sendToSegment(payload)
//   DELETE /api/admin/notifications/{id}       -> deleteNotification(id)
import { notificationsMockData } from "../data/notificationsMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let notifications = [...notificationsMockData];

// Every mock user "belongs" to one of these segments so segment sends have
// something plausible to fan out to — the real API resolves this from user/
// subscription data server-side.
const SEGMENT_SIZE = {
  AllUsers: 842,
  PlusUsers: 213,
  FreeUsers: 629,
  InactiveUsers: 174,
  NewUsers: 58,
  WorkoutInactiveUsers: 96,
};

export const notificationService = {
  /** GET /api/admin/notifications — AdminNotificationListRequest */
  getNotifications(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(notifications, {
      search: params.search,
      searchFields: ["title", "body", "userEmail"],
      filters: { userId: params.userId, isRead: params.isRead },
      dateRange: params.dateRange,
      dateField: "createdAt",
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  getNotificationById(id) {
    return simulateLatency(apiSuccess(notifications.find((n) => n.id === Number(id)) ?? null), 150);
  },

  /** POST /api/admin/notifications/user — AdminSendUserNotificationRequest */
  sendToUser(payload) {
    const newNotification = {
      id: Math.max(0, ...notifications.map((n) => n.id)) + 1,
      userId: payload.userId,
      userEmail: `user${payload.userId}@example.com`,
      isRead: false,
      readAt: null,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    notifications = [newNotification, ...notifications];
    return simulateLatency(apiSuccess(newNotification), 300);
  },

  /** POST /api/admin/notifications/broadcast — AdminBroadcastNotificationRequest */
  broadcast(payload) {
    void payload;
    return simulateLatency(apiSuccess({ recipientCount: SEGMENT_SIZE.AllUsers }), 400);
  },

  /** POST /api/admin/notifications/segment — AdminSegmentNotificationRequest */
  sendToSegment(payload) {
    return simulateLatency(apiSuccess({ recipientCount: SEGMENT_SIZE[payload.segment] ?? 0 }), 400);
  },

  /** DELETE /api/admin/notifications/{id} */
  deleteNotification(id) {
    notifications = notifications.filter((n) => n.id !== Number(id));
    return simulateLatency(apiSuccess(null), 200);
  },
};

export const NOTIFICATION_SEGMENTS = [
  { value: "AllUsers", label: "All Users" },
  { value: "PlusUsers", label: "Plus Users" },
  { value: "FreeUsers", label: "Free Users" },
  { value: "InactiveUsers", label: "Inactive Users" },
  { value: "NewUsers", label: "New Users" },
  { value: "WorkoutInactiveUsers", label: "Workout Inactive Users" },
];
