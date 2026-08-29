// Mock data shaped to match MerfitApi's real DTOs (see MerfitApi repo:
// MerfitApi.Business/Dtos/Faq/AdminFaqDtos.cs). Note AdminFaqCategoryDto has
// no IsActive field — categories aren't independently enable/disable-able
// in this API, only individual FAQs are.

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// AdminFaqCategoryDto[]
export const faqCategoriesMockData = [
  { id: 1, name: "Getting Started", sortOrder: 1 },
  { id: 2, name: "Subscriptions & Billing", sortOrder: 2 },
  { id: 3, name: "Workouts", sortOrder: 3 },
  { id: 4, name: "Nutrition", sortOrder: 4 },
  { id: 5, name: "Account & Privacy", sortOrder: 5 },
].map((c, i) => ({ ...c, createdAt: daysAgo(300 - i * 10), updatedAt: daysAgo(30 + i) }));

// AdminFaqDto[]
const RAW_FAQS = [
  { categoryId: 1, question: "How do I create an account?", answer: "Download the app and tap Sign Up to create your account with email or Apple/Google sign-in." },
  { categoryId: 1, question: "Is Merfit free to use?", answer: "Yes, Merfit has a free tier. Merfit Plus unlocks additional features like AI-generated workouts." },
  { categoryId: 2, question: "How do I cancel my subscription?", answer: "Go to your device's subscription settings (App Store or Play Store) to manage or cancel." },
  { categoryId: 2, question: "Will I be charged after my free trial?", answer: "Yes, unless you cancel before the trial period ends." },
  { categoryId: 2, question: "Can I get a refund?", answer: "Refunds are handled by Apple or Google depending on your purchase platform." },
  { categoryId: 3, question: "Can I create custom workouts?", answer: "Yes, use the AI workout generator or build one manually from the exercise library." },
  { categoryId: 3, question: "How is my Merfit Score calculated?", answer: "Your score combines workout consistency, nutrition logging, and overall activity." },
  { categoryId: 4, question: "Can I log food by scanning a barcode?", answer: "Yes, use the barcode scanner in the nutrition tab to quickly log packaged foods." },
  { categoryId: 4, question: "Does Merfit support custom macros?", answer: "Yes, you can set custom calorie and macro targets in your nutrition goals." },
  { categoryId: 5, question: "How do I delete my account?", answer: "Go to Settings > Account > Delete Account. This action is permanent." },
  { categoryId: 5, question: "How is my data protected?", answer: "We use industry-standard encryption and never sell your personal data." },
];

export const faqsMockData = RAW_FAQS.map((faq, i) => ({
  id: i + 1,
  ...faq,
  categoryName: faqCategoriesMockData.find((c) => c.id === faq.categoryId)?.name ?? "",
  sortOrder: i,
  isActive: i % 9 !== 0,
  createdAt: daysAgo(200 - i * 5),
  updatedAt: daysAgo(10 + i),
}));
