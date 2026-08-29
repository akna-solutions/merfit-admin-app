// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/Languages/AdminLanguageDtos.cs and
// MerfitApi.Business/Dtos/Translations/AdminTranslationDtos.cs). Note the
// real model is flat — one row per (languageId, resourceKey) pair — not a
// single row with a column per language. The UI pivots two chosen
// languages' rows into a side-by-side grid client-side.

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const RESOURCE_KEYS = [
  "common.save", "common.cancel", "common.delete", "common.confirm",
  "workout.start", "workout.finish", "workout.rest", "workout.skip",
  "dashboard.users", "dashboard.revenue", "dashboard.workouts",
  "nutrition.addFood", "nutrition.dailyGoal", "nutrition.water",
  "subscription.upgrade", "subscription.cancel", "subscription.renew",
  "notification.title", "notification.markRead",
  "settings.language", "settings.theme", "settings.notifications",
];

const VALUES = {
  tr: {
    "common.save": "Kaydet", "common.cancel": "İptal", "common.delete": "Sil", "common.confirm": "Onayla",
    "workout.start": "Başla", "workout.finish": "Bitir", "workout.rest": "Dinlen", "workout.skip": "Atla",
    "dashboard.users": "Kullanıcılar", "dashboard.revenue": "Gelir", "dashboard.workouts": "Antrenmanlar",
    "nutrition.addFood": "Besin Ekle", "nutrition.dailyGoal": "Günlük Hedef", "nutrition.water": "Su",
    "subscription.upgrade": "Yükselt", "subscription.cancel": "İptal Et", "subscription.renew": "Yenile",
    "notification.title": "Bildirim", "notification.markRead": "Okundu İşaretle",
    "settings.language": "Dil", "settings.theme": "Tema", "settings.notifications": "Bildirimler",
  },
  en: {
    "common.save": "Save", "common.cancel": "Cancel", "common.delete": "Delete", "common.confirm": "Confirm",
    "workout.start": "Start", "workout.finish": "Finish", "workout.rest": "Rest", "workout.skip": "Skip",
    "dashboard.users": "Users", "dashboard.revenue": "Revenue", "dashboard.workouts": "Workouts",
    "nutrition.addFood": "Add Food", "nutrition.dailyGoal": "Daily Goal", "nutrition.water": "Water",
    "subscription.upgrade": "Upgrade", "subscription.cancel": "Cancel", "subscription.renew": "Renew",
    "notification.title": "Notification", "notification.markRead": "Mark as Read",
    "settings.language": "Language", "settings.theme": "Theme", "settings.notifications": "Notifications",
  },
  de: {
    "common.save": "Speichern", "common.cancel": "Abbrechen",
    // Deliberately incomplete — most keys are missing a German translation,
    // exercising the "no value for this language yet" cell state.
  },
};

// AdminLanguageDto[]
export const languagesMockData = [
  { id: 1, code: "tr", name: "Turkish", isDefault: true, isActive: true },
  { id: 2, code: "en", name: "English", isDefault: false, isActive: true },
  { id: 3, code: "de", name: "German", isDefault: false, isActive: false },
].map((l, i) => ({
  ...l,
  translationCount: Object.keys(VALUES[l.code] ?? {}).length,
  createdAt: daysAgo(300 - i * 20),
  updatedAt: daysAgo(10 + i),
}));

// AdminTranslationDto[] — flat, one row per (languageId, resourceKey)
export const translationsMockData = languagesMockData.flatMap((lang) =>
  RESOURCE_KEYS.filter((key) => VALUES[lang.code]?.[key] !== undefined).map((key, i) => ({
    id: lang.id * 1000 + i,
    languageId: lang.id,
    languageCode: lang.code,
    resourceKey: key,
    value: VALUES[lang.code][key],
    createdAt: daysAgo(200 - i * 3),
    updatedAt: daysAgo(5 + i),
  })),
);

export const ALL_RESOURCE_KEYS = RESOURCE_KEYS;
