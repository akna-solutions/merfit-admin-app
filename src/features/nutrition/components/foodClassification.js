// Besin siniflandirmasi (MerfitApi AdminUpsertFoodRequest: category, mealTypes, allergens, dietTags).
// Musteri uygulamasindaki kisisel beslenme programi yalnizca kategori ve uygun ogun girilmis besinleri
// kullanir. Alerjen/diyet bilgisi "dogrulanmadi" (null) birakilan besin, alerjisi olan veya vejetaryen/vegan
// kullanicilara hic onerilmez; bos liste ise "alerjen icermez" / "et-balik icerir" anlamina gelir.

export const FOOD_CATEGORY_OPTIONS = [
  { value: "ProteinSource", label: "Protein kaynağı (et, tavuk, balık, yumurta, tofu)" },
  { value: "Dairy", label: "Süt ürünü" },
  { value: "Legume", label: "Baklagil" },
  { value: "GrainStarch", label: "Tahıl / nişastalı" },
  { value: "Vegetable", label: "Sebze" },
  { value: "Fruit", label: "Meyve" },
  { value: "NutsSeedsFats", label: "Kuruyemiş / tohum / yağ" },
  { value: "Other", label: "Diğer (programlarda kullanılmaz)" },
];

export const MEAL_TYPE_OPTIONS = [
  { value: "Breakfast", label: "Kahvaltı" },
  { value: "Lunch", label: "Öğle" },
  { value: "Dinner", label: "Akşam" },
  { value: "Snack", label: "Ara öğün" },
];

export const ALLERGEN_OPTIONS = [
  { value: "Gluten", label: "Gluten" },
  { value: "Milk", label: "Süt / laktoz" },
  { value: "Egg", label: "Yumurta" },
  { value: "TreeNuts", label: "Ağaç kuruyemişleri" },
  { value: "Peanut", label: "Yer fıstığı" },
  { value: "Soy", label: "Soya" },
  { value: "Fish", label: "Balık" },
  { value: "Shellfish", label: "Kabuklu deniz ürünü" },
  { value: "Sesame", label: "Susam" },
];

export const DIET_OPTIONS = [
  { value: "unverified", label: "Doğrulanmadı (vejetaryen/vegan kullanıcılara önerilmez)" },
  { value: "none", label: "Et / balık içerir" },
  { value: "vegetarian", label: "Vejetaryen" },
  { value: "vegan", label: "Vegan (vejetaryen de sayılır)" },
];

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value;

export const categoryLabel = (value) => (value ? labelOf(FOOD_CATEGORY_OPTIONS, value) : null);
export const mealTypeLabels = (values) => (values ?? []).map((v) => labelOf(MEAL_TYPE_OPTIONS, v));
export const allergenLabels = (values) => (values ?? []).map((v) => labelOf(ALLERGEN_OPTIONS, v));

function dietFromTags(tags) {
  if (tags == null) return "unverified";
  if (tags.includes("Vegan")) return "vegan";
  if (tags.includes("Vegetarian")) return "vegetarian";
  return "none";
}

const DIET_TAGS = {
  unverified: null,
  none: [],
  vegetarian: ["Vegetarian"],
  vegan: ["Vegetarian", "Vegan"],
};

export const dietLabel = (tags) => labelOf(DIET_OPTIONS, dietFromTags(tags));

/** API'den gelen besini form alanlarina cevirir. */
export function toClassificationFormValues(food) {
  return {
    category: food?.category ?? undefined,
    mealTypes: food?.mealTypes ?? [],
    allergensVerified: food?.allergens != null,
    allergens: food?.allergens ?? [],
    diet: dietFromTags(food?.dietTags),
  };
}

/** Form alanlarini AdminUpsertFoodRequest alanlarina cevirir. */
export function toClassificationPayload(values) {
  const { allergensVerified, diet, ...rest } = values;
  return {
    ...rest,
    category: values.category || null,
    mealTypes: values.mealTypes?.length ? values.mealTypes : null,
    allergens: allergensVerified ? values.allergens ?? [] : null,
    dietTags: DIET_TAGS[diet ?? "unverified"],
  };
}
