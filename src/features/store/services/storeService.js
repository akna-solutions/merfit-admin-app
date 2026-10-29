// MerfitApi: MerfitApi.Api/Controllers/Admin/AdminStore*Controller.cs (MB Shop yönetimi).
// Tablolar MerfitCustomerApi'nin "store" şemasındadır; mobil uygulama aynı kayıtları /api/store uçlarından okur.
// Yetki sunucuda AdminOnly politikasıyla korunur; bu panel yalnızca istemcidir.
import { apiClient, buildQuery } from "../../../utils/apiClient";

const BASE = "/api/admin/store";

export const storeCategoryService = {
  /** GET /api/admin/store/categories — AdminStoreCategoryListRequest */
  getCategories(params = {}) {
    const { page = 1, pageSize = 50, search, isActive } = params;
    return apiClient.get(`${BASE}/categories${buildQuery({ page, pageSize, search, isActive })}`);
  },
  createCategory(payload) {
    return apiClient.post(`${BASE}/categories`, payload);
  },
  updateCategory(id, payload) {
    return apiClient.put(`${BASE}/categories/${id}`, payload);
  },
  updateStatus(id, { isActive }) {
    return apiClient.patch(`${BASE}/categories/${id}/status`, { isActive });
  },
  /** Ürünü veya alt kategorisi olan kategori silinemez (409). */
  deleteCategory(id) {
    return apiClient.delete(`${BASE}/categories/${id}`);
  },
};

export const storeProductService = {
  /** GET /api/admin/store/products — AdminProductListRequest */
  getProducts(params = {}) {
    const { page = 1, pageSize = 20, search, categoryId, isActive, isFeatured, outOfStock, lowStockThreshold, sortBy, sortDirection } = params;
    return apiClient.get(
      `${BASE}/products${buildQuery({ page, pageSize, search, categoryId, isActive, isFeatured, outOfStock, lowStockThreshold, sortBy, sortDirection })}`,
    );
  },
  getProduct(id) {
    return apiClient.get(`${BASE}/products/${id}`);
  },
  /** AdminUpsertProductRequest — stockQuantity yalnızca oluştururken kullanılır. */
  createProduct(payload) {
    return apiClient.post(`${BASE}/products`, payload);
  },
  /** Stok bu uçla değişmez; stok için adjustStock kullanılır. */
  updateProduct(id, payload) {
    return apiClient.put(`${BASE}/products/${id}`, payload);
  },
  updateStatus(id, { isActive }) {
    return apiClient.patch(`${BASE}/products/${id}/status`, { isActive });
  },
  /** PATCH /api/admin/store/products/{id}/stock — { delta, note }; stok eksiye düşecekse 409. */
  adjustStock(id, { delta, note }) {
    return apiClient.patch(`${BASE}/products/${id}/stock`, { delta, note });
  },
  /** Siparişlerde geçen ürün silinemez (409); pasife alınmalıdır. */
  deleteProduct(id) {
    return apiClient.delete(`${BASE}/products/${id}`);
  },
};

export const storeCampaignService = {
  getCampaigns(params = {}) {
    const { page = 1, pageSize = 50, search, isActive } = params;
    return apiClient.get(`${BASE}/campaigns${buildQuery({ page, pageSize, search, isActive })}`);
  },
  getCampaign(id) {
    return apiClient.get(`${BASE}/campaigns/${id}`);
  },
  createCampaign(payload) {
    return apiClient.post(`${BASE}/campaigns`, payload);
  },
  updateCampaign(id, payload) {
    return apiClient.put(`${BASE}/campaigns/${id}`, payload);
  },
  updateStatus(id, { isActive }) {
    return apiClient.patch(`${BASE}/campaigns/${id}/status`, { isActive });
  },
  deleteCampaign(id) {
    return apiClient.delete(`${BASE}/campaigns/${id}`);
  },
};

export const storeOrderService = {
  /** GET /api/admin/store/orders — AdminStoreOrderListRequest */
  getOrders(params = {}) {
    const { page = 1, pageSize = 20, search, status, paymentStatus, paymentMethod, userId, from, to } = params;
    return apiClient.get(`${BASE}/orders${buildQuery({ page, pageSize, search, status, paymentStatus, paymentMethod, userId, from, to })}`);
  },
  getOrder(id) {
    return apiClient.get(`${BASE}/orders/${id}`);
  },
  /** Yalnızca sunucunun izin verdiği geçişler (allowedStatusTransitions) kabul edilir; aksi halde 409. */
  updateStatus(id, { status, note }) {
    return apiClient.patch(`${BASE}/orders/${id}/status`, { status, note });
  },
  updatePaymentStatus(id, { paymentStatus, paymentReference, note }) {
    return apiClient.patch(`${BASE}/orders/${id}/payment-status`, { paymentStatus, paymentReference, note });
  },
};
