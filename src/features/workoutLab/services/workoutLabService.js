// MerfitApi: MerfitApi.Api/Controllers/Admin/AdminWorkoutLabController.cs (Antrenman Laboratuvarı).
// Program bu panelde ya da MerfitApi'de üretilmez: test kaydı "Pending" açılır, MerfitCustomerApi'deki gerçek
// WorkoutPlanGenerator kaydı işleyip sonucu aynı satıra yazar. Panel detay ucunu yoklayarak sonucu bekler.
// Testler gerçek kullanıcılardan bağımsızdır; kullanıcı, plan veya bildirim oluşturulmaz.
import { apiClient, buildQuery } from "../../../utils/apiClient";

const BASE = "/api/admin/workout-lab";

export const workoutLabService = {
  /** Form seçenekleri (hedefler, ekipman kataloğu, süreler) ve katalog/kuyruk durumu. */
  getOptions() {
    return apiClient.get(`${BASE}/options`);
  },
  /** AdminWorkoutLabSimulationListRequest */
  getSimulations(params = {}) {
    const {
      page = 1, pageSize = 20, search, status, goal, experienceLevel, trainingLocation, isPlus, rating,
      isEvaluated, hasFailedChecks, algorithmVersion, createdFrom, createdTo, sortBy, sortDirection,
    } = params;
    return apiClient.get(
      `${BASE}/simulations${buildQuery({
        page, pageSize, search, status, goal, experienceLevel, trainingLocation, isPlus, rating,
        isEvaluated, hasFailedChecks, algorithmVersion, createdFrom, createdTo, sortBy, sortDirection,
      })}`,
    );
  },
  getSimulation(id) {
    return apiClient.get(`${BASE}/simulations/${id}`);
  },
  /** { name, profile } — 201, status "Pending". */
  createSimulation(payload) {
    return apiClient.post(`${BASE}/simulations`, payload);
  },
  /** Aynı profili güncel algoritma ve katalogla yeni bir test olarak çalıştırır. */
  rerun(id) {
    return apiClient.post(`${BASE}/simulations/${id}/rerun`);
  },
  /** { rating, missingPoints, problemItems: [{ dayOfWeek, exerciseId, exerciseName, note }], exerciseSuggestions, comment } */
  evaluate(id, payload) {
    return apiClient.put(`${BASE}/simulations/${id}/evaluation`, payload);
  },
  deleteSimulation(id) {
    return apiClient.delete(`${BASE}/simulations/${id}`);
  },
  compare(leftId, rightId) {
    return apiClient.get(`${BASE}/compare${buildQuery({ leftId, rightId })}`);
  },
};
