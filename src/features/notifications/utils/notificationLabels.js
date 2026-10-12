// MerfitApi / MerfitCustomerApi enum adlarinin Turkce karsiliklari.

export const NOTIFICATION_TYPE_LABELS = {
  WorkoutReminder: "Antrenman Hatırlatıcısı",
  GoalReminder: "Hedef Hatırlatıcısı",
  StreakReminder: "Seri Hatırlatıcısı",
  ProgressUpdate: "İlerleme",
  LeaderboardUpdate: "Sıralama",
  Achievement: "Başarım",
  Reward: "Ödül",
  Subscription: "Abonelik",
  System: "Sistem",
  Marketing: "Pazarlama",
  NutritionReminder: "Beslenme Hatırlatıcısı",
  WaterReminder: "Su Hatırlatıcısı",
  DailyMotivation: "Günlük Motivasyon",
  Announcement: "Duyuru",
};

export const SEGMENT_LABELS = {
  AllUsers: "Tüm Kullanıcılar",
  PlusUsers: "Plus Kullanıcılar",
  FreeUsers: "Ücretsiz Kullanıcılar",
  InactiveUsers: "Pasif Kullanıcılar (30 gün giriş yok)",
  NewUsers: "Yeni Kullanıcılar (son 7 gün)",
  WorkoutInactiveUsers: "Antrenman Yapmayanlar (14 gün)",
  SingleUser: "Tek Kullanıcı",
  SelectedUsers: "Seçili Kullanıcılar",
};

export const RULE_KIND_LABELS = {
  NutritionReminder: "Beslenme Hatırlatıcısı",
  WorkoutReminder: "Antrenman Hatırlatıcısı",
  DailyMotivation: "Günlük Motivasyon",
};

/** Kural turunun kullandigi sablon turu (MerfitApi NotificationContentRules.TypeFor). */
export const RULE_KIND_TEMPLATE_TYPE = {
  NutritionReminder: "NutritionReminder",
  WorkoutReminder: "WorkoutReminder",
  DailyMotivation: "DailyMotivation",
};

export const RULE_STATUS_LABELS = { Active: "Aktif", Paused: "Duraklatıldı", Inactive: "Pasif" };

export const MEAL_TYPE_LABELS = { Breakfast: "Kahvaltı", Lunch: "Öğle Yemeği", Dinner: "Akşam Yemeği", Snack: "Ara Öğün" };

export const CAMPAIGN_STATUS_LABELS = {
  Draft: "Taslak",
  Scheduled: "Zamanlandı",
  Processing: "Alıcılar Hazırlanıyor",
  Dispatching: "Gönderiliyor",
  Completed: "Tamamlandı",
  Cancelled: "İptal Edildi",
  Failed: "Başarısız",
};

export const DISPATCH_STATUS_LABELS = {
  Pending: "Kuyrukta",
  Processing: "İşleniyor",
  Sent: "Push Gönderildi",
  InAppOnly: "Yalnızca Uygulama İçi",
  Suppressed: "Gönderilmedi",
  Failed: "Başarısız",
  Cancelled: "İptal",
};

export const DISPATCH_SOURCE_LABELS = { Rule: "Kural", Campaign: "Kampanya", MonthlyReward: "Aylık Ödül" };

export const DELIVERY_STATUS_LABELS = {
  Accepted: "Sağlayıcı Kabul Etti",
  Rejected: "Reddedildi",
  TransientError: "Geçici Hata",
  ReceiptOk: "Cihaza İletildi",
  ReceiptError: "İletim Hatası",
};

export const DISPATCH_REASON_LABELS = {
  Expired: "Süresi doldu",
  UserInactive: "Kullanıcı pasif",
  RuleNotActive: "Kural aktif değil",
  ConditionMet: "Koşul artık geçerli değil (kayıt/antrenman yapıldı)",
  CampaignCancelled: "Kampanya iptal edildi",
  PreferenceDisabled: "Kullanıcı bu türü kapatmış",
  QuietHours: "Sessiz saatler",
  QuietHoursDeferred: "Sessiz saat sonrasına ertelendi",
  RetryScheduled: "Yeniden denenecek",
  PushDisabled: "Push kapalı",
  NoDevice: "Kayıtlı cihaz yok",
  DailyLimit: "Günlük limit",
  DevicesInvalid: "Cihaz tokenları geçersiz",
  RetriesExhausted: "Yeniden deneme hakkı bitti",
  ProviderRejected: "Sağlayıcı reddetti",
};

export const MONTHLY_RUN_STATUS_LABELS = {
  NotQueued: "Kuyrukta Değil",
  Pending: "Bekliyor",
  Processing: "İşleniyor",
  Completed: "Tamamlandı",
  Failed: "Başarısız",
};

export const STATUS_COLORS = {
  draft: "default",
  scheduled: "blue",
  processing: "gold",
  dispatching: "processing",
  completed: "green",
  cancelled: "default",
  failed: "red",
  pending: "gold",
  sent: "green",
  inapponly: "cyan",
  suppressed: "default",
  active: "green",
  paused: "orange",
  inactive: "default",
  notqueued: "default",
  receiptok: "green",
  accepted: "blue",
  rejected: "red",
  transienterror: "orange",
  receipterror: "red",
};

export const label = (map, value) => (value ? map[value] ?? value : "—");

export const toOptions = (map, values) => (values ?? Object.keys(map)).map((value) => ({ value, label: map[value] ?? value }));
