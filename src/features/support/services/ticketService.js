// Mock implementation of AdminSupportTicketController (see MerfitApi repo:
// MerfitApi.Api/Controllers/Admin/AdminSupportTicketController.cs).
//
//   GET   /api/admin/support/tickets                  -> getTickets(params)
//   GET   /api/admin/support/tickets/{id}              -> getTicketById(id)
//   PATCH /api/admin/support/tickets/{id}/status        -> updateStatus(id, { status })
//   PATCH /api/admin/support/tickets/{id}/priority      -> updatePriority(id, { priority })
//   GET   /api/admin/support/tickets/{id}/messages      -> getMessages(id, params)
//   POST  /api/admin/support/tickets/{id}/messages      -> addMessage(id, { message })
//   POST  /api/admin/support/tickets/{id}/close         -> closeTicket(id)
import { ticketsMockData, buildTicketMessages } from "../data/supportMockData";
import { simulateLatency, apiSuccess, apiPagedSuccess, queryRows } from "../../../utils/queryMockData";

let tickets = [...ticketsMockData];
const messagesStore = {};
function getMessagesFor(ticket) {
  if (!messagesStore[ticket.id]) {
    messagesStore[ticket.id] = buildTicketMessages(ticket);
  }
  return messagesStore[ticket.id];
}

export const ticketService = {
  /** GET /api/admin/support/tickets — AdminSupportTicketListRequest */
  getTickets(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const result = queryRows(tickets, {
      search: params.search,
      searchFields: ["subject", "userEmail"],
      filters: { status: params.status, priority: params.priority, userId: params.userId },
      dateRange: params.dateRange,
      dateField: "createdAt",
      page,
      pageSize,
    });
    return simulateLatency(apiPagedSuccess(result.items, page, pageSize, result.total));
  },

  getTicketById(id) {
    const ticket = tickets.find((t) => t.id === Number(id));
    return simulateLatency(apiSuccess(ticket ?? null), 150);
  },

  /** PATCH /api/admin/support/tickets/{id}/status */
  updateStatus(id, { status }) {
    tickets = tickets.map((t) =>
      t.id === Number(id) ? { ...t, status, closedAt: status === "Closed" ? new Date().toISOString() : t.closedAt } : t,
    );
    return simulateLatency(apiSuccess(null), 200);
  },

  /** PATCH /api/admin/support/tickets/{id}/priority */
  updatePriority(id, { priority }) {
    tickets = tickets.map((t) => (t.id === Number(id) ? { ...t, priority } : t));
    return simulateLatency(apiSuccess(null), 200);
  },

  /** GET /api/admin/support/tickets/{id}/messages */
  getMessages(id, params = {}) {
    const { page = 1, pageSize = 50 } = params;
    const ticket = tickets.find((t) => t.id === Number(id));
    const items = ticket ? getMessagesFor(ticket) : [];
    return simulateLatency(apiPagedSuccess(items, page, pageSize, items.length), 200);
  },

  /** POST /api/admin/support/tickets/{id}/messages — AdminSendTicketMessageRequest */
  addMessage(id, { message }) {
    const ticket = tickets.find((t) => t.id === Number(id));
    if (!ticket) return simulateLatency(apiSuccess(null), 150);
    const list = getMessagesFor(ticket);
    const newMessage = {
      id: ticket.id * 100 + list.length,
      ticketId: ticket.id,
      senderUserId: 0,
      senderEmail: "admin@merfit.com",
      isFromAdmin: true,
      message,
      createdAt: new Date().toISOString(),
    };
    messagesStore[ticket.id] = [...list, newMessage];
    tickets = tickets.map((t) =>
      t.id === Number(id) ? { ...t, messageCount: t.messageCount + 1 } : t,
    );
    return simulateLatency(apiSuccess(newMessage), 250);
  },

  /** POST /api/admin/support/tickets/{id}/close */
  closeTicket(id) {
    tickets = tickets.map((t) =>
      t.id === Number(id) ? { ...t, status: "Closed", closedAt: new Date().toISOString() } : t,
    );
    return simulateLatency(apiSuccess(null), 200);
  },
};
