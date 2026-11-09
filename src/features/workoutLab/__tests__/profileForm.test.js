import { INITIAL_FORM, applyEquipmentChange, fromProfile, sortDays, toRequest, validateForm } from "../utils/profileForm";

describe("profileForm", () => {
  it("'Hiç ekipmanım yok' seçimleri temizler, ekipman seçmek işareti kaldırır", () => {
    const withEq = { ...INITIAL_FORM, equipmentIds: [1, 2] };
    const none = applyEquipmentChange(withEq, { noEquipment: true });
    expect(none).toMatchObject({ noEquipment: true, equipmentIds: [] });
    expect(applyEquipmentChange(none, { equipmentIds: [3] })).toMatchObject({ noEquipment: false, equipmentIds: [3] });
  });

  it("ev profilinde ekipman ya da 'ekipman yok' zorunludur; spor salonunda değildir", () => {
    expect(validateForm({ ...INITIAL_FORM }).equipmentIds).toBeDefined();
    expect(validateForm({ ...INITIAL_FORM, noEquipment: true })).toEqual({});
    expect(validateForm({ ...INITIAL_FORM, trainingLocation: "Gym" })).toEqual({});
  });

  it("belirli günlerde en az 2 gün ister", () => {
    const v = { ...INITIAL_FORM, noEquipment: true, useSpecificDays: true, trainingDays: ["Mon"] };
    expect(validateForm(v).trainingDays).toBeDefined();
    expect(validateForm({ ...v, trainingDays: ["Mon", "Thu"] })).toEqual({});
  });

  it("günleri haftaya göre sıralar ve tekrarları atar", () => {
    expect(sortDays(["Fri", "Mon", "Fri", "xx", "Wed"])).toEqual(["Mon", "Wed", "Fri"]);
  });

  it("spor salonunda ekipman listesini göndermez", () => {
    const req = toRequest({ ...INITIAL_FORM, trainingLocation: "Gym", equipmentIds: [1, 2], noEquipment: true });
    expect(req.profile.equipmentIds).toEqual([]);
    expect(req.profile.noEquipment).toBe(false);
  });

  it("belirli günler seçilince gün sayısı bu günlerden türetilir", () => {
    const req = toRequest({
      ...INITIAL_FORM, noEquipment: true, trainingDaysPerWeek: 6, useSpecificDays: true, trainingDays: ["Sat", "Tue", "Thu"],
    });
    expect(req.profile.trainingDays).toEqual(["Tue", "Thu", "Sat"]);
    expect(req.profile.trainingDaysPerWeek).toBe(3);
  });

  it("boş alanları null gönderir (algoritma varsayılanları)", () => {
    const req = toRequest({ ...INITIAL_FORM, goal: undefined, workoutDurationMin: undefined, trainingDaysPerWeek: undefined, name: "  " });
    expect(req.name).toBeNull();
    expect(req.profile).toMatchObject({ goal: null, workoutDurationMin: null, trainingDaysPerWeek: null, age: null });
  });

  it("kayıtlı profil forma geri yüklenir ve aynı isteği üretir", () => {
    const profile = {
      age: 30, gender: "Female", heightCm: 170, weightKg: 65, targetWeightKg: 60, goal: "LoseWeight",
      experienceLevel: "Advanced", trainingLocation: "Home", equipmentIds: [1, 5], noEquipment: false,
      trainingDaysPerWeek: 2, trainingDays: ["Wed", "Mon"], workoutDurationMin: 20, isPlus: true,
    };
    const req = toRequest(fromProfile(profile, "Test"));
    expect(req.name).toBe("Test");
    expect(req.profile).toEqual({ ...profile, trainingDays: ["Mon", "Wed"] });
  });
});
