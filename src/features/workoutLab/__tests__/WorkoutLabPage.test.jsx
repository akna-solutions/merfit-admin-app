import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { App } from "antd";
import WorkoutLabPage from "../pages/WorkoutLabPage";
import { workoutLabService } from "../services/workoutLabService";

// @ant-design/icons yalnızca ESM yayınlar ve CRA'nın Jest ayarı node_modules'u dönüştürmez.
jest.mock("@ant-design/icons", () =>
  new Proxy({ __esModule: true }, { get: (target, key) => (key === "__esModule" ? true : () => null) }),
);
// react-router v7 paket çözümü CRA Jest'inde çalışmaz; PageHeader yalnızca Link kullanır.
jest.mock("react-router-dom", () => ({ Link: ({ children }) => children }));
jest.mock("../services/workoutLabService", () => ({
  workoutLabService: {
    getOptions: jest.fn(),
    getSimulations: jest.fn(),
    getSimulation: jest.fn(),
    createSimulation: jest.fn(),
    rerun: jest.fn(),
    evaluate: jest.fn(),
    deleteSimulation: jest.fn(),
    compare: jest.fn(),
  },
}));

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({ matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() }));
});

const options = {
  goals: [
    { value: "BuildMuscle", label: "Kas kazanmak" },
    { value: "GetStronger", label: "Güçlenmek" },
    { value: "LoseWeight", label: "Kilo vermek" },
  ],
  experienceLevels: [{ value: "Beginner", label: "Başlangıç" }],
  trainingLocations: [{ value: "Home", label: "Ev" }, { value: "Gym", label: "Spor salonu" }],
  genders: [{ value: "Male", label: "Erkek" }],
  weekDays: [],
  durationOptions: [15, 20, 30, 45, 60, 75, 90],
  equipment: [{ id: 1, name: "Dambıl", slug: "dumbbell" }],
  targetTrainingDaysByExperience: { Beginner: 3, Intermediate: 4, Advanced: 5 },
  loseWeightExtraTrainingDays: 1,
  defaultWorkoutDurationMin: 45,
  durationToleranceMin: 15,
  activeWorkoutCount: 12,
  activePremiumWorkoutCount: 3,
  activeScoredWorkoutCount: 10,
  latestAlgorithmVersion: "2026.11-v1",
  pendingCount: 0,
};

const completed = {
  id: 7,
  name: "Başlangıç ev",
  status: "Completed",
  goal: "BuildMuscle",
  experienceLevel: "Beginner",
  trainingLocation: "Home",
  trainingDaysPerWeek: 2,
  workoutDurationMin: 45,
  isPlus: false,
  algorithmVersion: "2026.11-v1",
  createdAt: "2026-11-08T10:00:00Z",
  profile: { trainingLocation: "Home", hasEquipment: false, trainingDays: [] },
  result: {
    algorithmVersion: "2026.11-v1",
    optionsFingerprint: "abc123",
    planName: "Plan",
    goal: "BuildMuscle",
    experience: "Beginner",
    targetDifficulty: "Beginner",
    poolStage: "Primary",
    cardioDays: 1,
    cardioTarget: 1,
    equipmentResolution: "None",
    equipment: [],
    days: [
      {
        dayOfWeek: "Mon",
        estimatedDurationMin: 40,
        workout: { id: 1, title: "Tüm Vücut A", difficulty: "Beginner", durationMin: 40 },
        exercises: [
          { exerciseId: 11, name: "Şınav", order: 1, muscleGroupName: "Göğüs", sets: 3, reps: 8, repsMax: 12, restSeconds: 90, kind: "Main" },
        ],
        cardioExercises: [],
      },
    ],
    metrics: { totalExercises: 1, totalSets: 3, averageDurationMin: 40, usedEquipmentCount: 0, muscleGroups: [] },
  },
  qualityChecks: [
    { code: "DuplicateExercises", title: "Tekrarlanan egzersiz", status: "Passed", message: "Tekrar yok.", rule: "Aynı egzersiz bir kez." },
  ],
  evaluation: null,
};

function renderPage() {
  return render(
    <App>
      <WorkoutLabPage />
    </App>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  workoutLabService.getOptions.mockResolvedValue({ data: options });
  workoutLabService.getSimulations.mockResolvedValue({ data: { items: [], totalCount: 0 } });
});

it("form seçeneklerini ve katalog durumunu gösterir", async () => {
  renderPage();
  expect(await screen.findByText("Katalog durumu")).toBeInTheDocument();
  expect(screen.getByText("Son algoritma sürümü: 2026.11-v1")).toBeInTheDocument();
});

it("tek müsait günle program üretmeye izin vermez; gün sayısını algoritmanın belirlediğini gösterir", async () => {
  renderPage();
  await screen.findByText("Katalog durumu");
  expect(screen.getByText(/bu profil için 3 gün/)).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Pzt"));
  fireEvent.click(screen.getByRole("button", { name: /Programı üret/ }));
  expect(await screen.findByText(/En az 2 gün seçin/)).toBeInTheDocument();
  expect(workoutLabService.createSimulation).not.toHaveBeenCalled();
});

it("test oluşturur, sonucu yoklar ve programı + kontrolleri gösterir", async () => {
  workoutLabService.createSimulation.mockResolvedValue({ data: { ...completed, status: "Pending", result: null } });
  workoutLabService.getSimulation.mockResolvedValue({ data: completed });
  renderPage();
  await screen.findByText("Katalog durumu");
  fireEvent.click(screen.getByLabelText("Ekipmansız"));
  fireEvent.click(screen.getByRole("button", { name: /Programı üret/ }));

  await waitFor(() => expect(workoutLabService.createSimulation).toHaveBeenCalled());
  const request = workoutLabService.createSimulation.mock.calls[0][0];
  expect(request.profile).toMatchObject({ trainingLocation: "Home", hasEquipment: false, trainingDays: [], goal: "BuildMuscle" });

  expect((await screen.findAllByText("Tüm Vücut A")).length).toBeGreaterThan(0);
  expect(screen.getByText("Şınav")).toBeInTheDocument();
  expect(screen.getByText("Kalite kontrolleri")).toBeInTheDocument();
  expect(within(screen.getByTestId("check-DuplicateExercises")).getByText("Başarılı")).toBeInTheDocument();
  expect(screen.getByText("Değerlendirme")).toBeInTheDocument();
});

it("başarısız testte algoritmanın hata mesajını gösterir", async () => {
  workoutLabService.createSimulation.mockResolvedValue({ data: { id: 8, status: "Pending" } });
  workoutLabService.getSimulation.mockResolvedValue({
    data: { ...completed, id: 8, status: "Failed", result: null, qualityChecks: null, errorMessage: "Uygun antrenman bulunamadı." },
  });
  renderPage();
  await screen.findByText("Katalog durumu");
  fireEvent.click(screen.getByLabelText("Ekipmansız"));
  fireEvent.click(screen.getByRole("button", { name: /Programı üret/ }));
  expect(await screen.findByText("Uygun antrenman bulunamadı.")).toBeInTheDocument();
});

it("geçmiş sekmesinde boş durum gösterir", async () => {
  renderPage();
  fireEvent.click(screen.getByRole("tab", { name: "Geçmiş" }));
  expect(await screen.findByText(/Henüz test yok/)).toBeInTheDocument();
});
