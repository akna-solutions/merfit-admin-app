// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
// MerfitApi.Api/Controllers/Admin/AdminSupportTicketController.cs
//
//   GET   /api/admin/support/tickets                  -> getTickets(params)
//   GET   /api/admin/support/tickets/{id}              -> getTicketById(id)
//   PATCH /api/admin/support/tickets/{id}/status        -> updateStatus(id, { status })
//   PATCH /api/admin/support/tickets/{id}/priority      -> updatePriority(id, { priority })
//   GET   /api/admin/support/tickets/{id}/messages      -> getMessages(id, params)
//   POST  /api/admin/support/tickets/{id}/messages      -> addMessage(id, { message })
//   POST  /api/admin/support/tickets/{id}/close         -> closeTicket(id)
import { apiClient, buildQuery } from "../../../utils/apiClient";

export const ticketService = {
  /** GET /api/admin/support/tickets — AdminSupportTicketListRequest */
  getTickets(params = {}) {
    const { page = 1, pageSize = 20, search, status, priority, userId, dateRange } = params;
    const [createdFrom, createdTo] = dateRange ?? [];
    return apiClient.get(
      `/api/admin/support/tickets${buildQuery({ page, pageSize, search, status, priority, userId, createdFrom, createdTo })}`,
    );
  },

  /** GET /api/admin/support/tickets/{id} */
  getTicketById(id) {
    return apiClient.get(`/api/admin/support/tickets/${id}`);
  },

  /** PATCH /api/admin/support/tickets/{id}/status — AdminUpdateTicketStatusRequest */
  updateStatus(id, { status }) {
    return apiClient.patch(`/api/admin/support/tickets/${id}/status`, { status });
  },

  /** PATCH /api/admin/support/tickets/{id}/priority — AdminUpdateTicketPriorityRequest */
  updatePriority(id, { priority }) {
    return apiClient.patch(`/api/admin/support/tickets/${id}/priority`, { priority });
  },

  /** GET /api/admin/support/tickets/{id}/messages — PagedRequest */
  getMessages(id, params = {}) {
    const { page = 1, pageSize = 50 } = params;
    return apiClient.get(`/api/admin/support/tickets/${id}/messages${buildQuery({ page, pageSize })}`);
  },

  /** POST /api/admin/support/tickets/{id}/messages — AdminSendTicketMessageRequest */
  addMessage(id, { message }) {
    return apiClient.post(`/api/admin/support/tickets/${id}/messages`, { message });
  },

  /** POST /api/admin/support/tickets/{id}/close */
  closeTicket(id) {
    return apiClient.post(`/api/admin/support/tickets/${id}/close`);
  },
};
