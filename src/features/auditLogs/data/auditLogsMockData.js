// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/Audit/AdminAuditLogDtos.cs). Fully read-only —
// this is exactly the trail the mock actions elsewhere in this app (status
// toggles, deletes, sends) would leave behind on the real audit log.

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function minutesAgo(n) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
}

const ADMIN_EMAILS = ["admin@merfit.com", "ops@merfit.com", "support-lead@merfit.com"];
const ACTIONS = ["Create", "Update", "Delete", "StatusChange", "Login", "Publish"];
const ENTITIES = ["User", "Workout", "Food", "SubscriptionProduct", "Content", "Faq", "Achievement", "SupportTicket"];

function sampleValue(entity, id) {
  switch (entity) {
    case "User":
      return { id, isActive: true };
    case "Workout":
      return { id, title: "Full Body Burn", isActive: true };
    case "Content":
      return { id, isActive: true, startAt: null };
    default:
      return { id };
  }
}

// AdminAuditLogListItemDto[] (+ AdminAuditLogDetailDto extras)
export const auditLogsMockData = Array.from({ length: 60 }, (_, i) => {
  const seed = i + 1;
  const admin = ADMIN_EMAILS[seed % ADMIN_EMAILS.length];
  const action = ACTIONS[seed % ACTIONS.length];
  const entity = ENTITIES[seed % ENTITIES.length];
  const entityId = 1 + (seed % 40);
  const createdAt = seed <= 8 ? minutesAgo(seed * 15) : daysAgo(seed % 30);

  const oldValue = action === "Create" ? null : sampleValue(entity, entityId);
  const newValue =
    action === "Delete"
      ? null
      : { ...sampleValue(entity, entityId), isActive: action === "StatusChange" ? seed % 2 === 0 : true };

  return {
    id: seed,
    adminUserId: seed % 10 === 0 ? null : (seed % 3) + 1,
    adminEmail: seed % 10 === 0 ? null : admin,
    action,
    entity,
    entityId,
    ipAddress: `192.168.${seed % 8}.${(seed * 7) % 255}`,
    createdAt,

    // AdminAuditLogDetailDto extras
    userAgent: seed % 2 === 0
      ? "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    oldValueJson: oldValue ? JSON.stringify(oldValue, null, 2) : null,
    newValueJson: newValue ? JSON.stringify(newValue, null, 2) : null,
  };
});
