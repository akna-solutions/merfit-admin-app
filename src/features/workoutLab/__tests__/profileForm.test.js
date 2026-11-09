import { INITIAL_FORM, fromProfile, sortDays, toRequest, validateForm } from "../utils/profileForm";

describe("profileForm", () => {
  it("müsait günler boş (tüm hafta) ya da en az 2 gün olmalı", () => {
    expect(validateForm({ ...INITIAL_FORM })).toEqual({});
    expect(validateForm({ ...INITIAL_FORM, availableDays: ["Mon"] }).availableDays).toBeDefined();
    expect(validateForm({ ...INITIAL_FORM, availableDays: ["Mon", "Thu"] })).toEqual({});
  });

  it("günleri haftaya göre sıralar ve tekrarları atar", () => {
    expect(sortDays(["Fri", "Mon", "Fri", "xx", "Wed"])).toEqual(["Mon", "Wed", "Fri"]);
  });

  it("ekipmanlı/ekipmansız bayrağını gönderir; spor salonu her zaman ekipmanlıdır", () => {
    expect(toRequest({ ...INITIAL_FORM, hasEquipment: false }).profile.hasEquipment).toBe(false);
    expect(toRequest({ ...INITIAL_FORM, hasEquipment: true }).profile.hasEquipment).toBe(true);
    expect(toRequest({ ...INITIAL_FORM, trainingLocation: "Gym", hasEquipment: false }).profile.hasEquipment).toBe(true);
  });

  it("gün sayısı göndermez, yalnızca sıralı müsait günleri gönderir", () => {
    const req = toRequest({ ...INITIAL_FORM, availableDays: ["Sat", "Tue", "Thu"] });
    expect(req.profile.trainingDays).toEqual(["Tue", "Thu", "Sat"]);
    expect(req.profile).not.toHaveProperty("trainingDaysPerWeek");
    expect(req.profile).not.toHaveProperty("equipmentIds");
  });

  it("boş alanları null gönderir (algoritma varsayılanları)", () => {
    const req = toRequest({ ...INITIAL_FORM, goal: undefined, workoutDurationMin: undefined, name: "  " });
    expect(req.name).toBeNull();
    expect(req.profile).toMatchObject({ goal: null, workoutDurationMin: null, age: null, trainingDays: [] });
  });

  it("kayıtlı profil forma geri yüklenir ve aynı isteği üretir", () => {
    const profile = {
      age: 30, gender: "Female", heightCm: 170, weightKg: 65, targetWeightKg: 60, goal: "LoseWeight",
      experienceLevel: "Advanced", trainingLocation: "Home", hasEquipment: false,
      trainingDays: ["Wed", "Mon"], workoutDurationMin: 20, isPlus: true,
    };
    const req = toRequest(fromProfile(profile, "Test"));
    expect(req.name).toBe("Test");
    expect(req.profile).toEqual({ ...profile, trainingDays: ["Mon", "Wed"] });
  });

  it("eski kayıtlarda bayrak ekipman listesinden türetilir", () => {
    expect(fromProfile({ trainingLocation: "Home", equipmentIds: [1, 5] }).hasEquipment).toBe(true);
    expect(fromProfile({ trainingLocation: "Home", noEquipment: true, equipmentIds: [] }).hasEquipment).toBe(false);
    expect(fromProfile({ trainingLocation: "Gym", noEquipment: true }).hasEquipment).toBe(true);
  });
});
