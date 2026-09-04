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
  { id: 1, name: "Başlarken", sortOrder: 1 },
  { id: 2, name: "Abonelik ve Faturalandırma", sortOrder: 2 },
  { id: 3, name: "Antrenmanlar", sortOrder: 3 },
  { id: 4, name: "Beslenme", sortOrder: 4 },
  { id: 5, name: "Hesap ve Gizlilik", sortOrder: 5 },
].map((c, i) => ({ ...c, createdAt: daysAgo(300 - i * 10), updatedAt: daysAgo(30 + i) }));

// AdminFaqDto[]
const RAW_FAQS = [
  { categoryId: 1, question: "Nasıl hesap oluştururum?", answer: "Uygulamayı indirin ve e-posta ya da Apple/Google ile giriş kullanarak hesap oluşturmak için Kaydol'a dokunun." },
  { categoryId: 1, question: "Merfit kullanmak ücretsiz mi?", answer: "Evet, Merfit'in ücretsiz bir seviyesi vardır. Merfit Plus, yapay zekâ ile oluşturulan antrenmanlar gibi ek özelliklerin kilidini açar." },
  { categoryId: 2, question: "Aboneliğimi nasıl iptal ederim?", answer: "Yönetmek veya iptal etmek için cihazınızın abonelik ayarlarına (App Store veya Play Store) gidin." },
  { categoryId: 2, question: "Ücretsiz deneme süresinden sonra ücretlendirilecek miyim?", answer: "Evet, deneme süresi bitmeden iptal etmezseniz ücretlendirilirsiniz." },
  { categoryId: 2, question: "Para iadesi alabilir miyim?", answer: "Para iadeleri, satın alma platformunuza bağlı olarak Apple veya Google tarafından yönetilir." },
  { categoryId: 3, question: "Kendi antrenmanımı oluşturabilir miyim?", answer: "Evet, yapay zekâ antrenman oluşturucusunu kullanabilir veya egzersiz kitaplığından manuel olarak bir tane oluşturabilirsiniz." },
  { categoryId: 3, question: "Merfit Skorum nasıl hesaplanır?", answer: "Skorunuz; antrenman düzenliliğinizi, beslenme kaydınızı ve genel aktivitenizi birleştirir." },
  { categoryId: 4, question: "Barkod okutarak besin kaydedebilir miyim?", answer: "Evet, paketli besinleri hızlıca kaydetmek için beslenme sekmesindeki barkod tarayıcıyı kullanabilirsiniz." },
  { categoryId: 4, question: "Merfit özel makro hedeflerini destekliyor mu?", answer: "Evet, beslenme hedeflerinizde özel kalori ve makro hedefleri belirleyebilirsiniz." },
  { categoryId: 5, question: "Hesabımı nasıl silerim?", answer: "Ayarlar > Hesap > Hesabı Sil yolunu izleyin. Bu işlem kalıcıdır." },
  { categoryId: 5, question: "Verilerim nasıl korunuyor?", answer: "Endüstri standardı şifreleme kullanıyoruz ve kişisel verilerinizi asla satmıyoruz." },
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
