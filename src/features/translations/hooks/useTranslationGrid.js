import { useCallback, useEffect, useMemo, useState } from "react";
import { translationService, languageService } from "../services/translationService";

// AdminTranslationController returns one flat row per (languageId,
// resourceKey) — this hook fetches two chosen languages' rows and pivots
// them into { resourceKey, [langA.code]: value, [langB.code]: value } rows
// for the side-by-side grid the admin actually wants to edit in.
export function useTranslationGrid() {
  const [languages, setLanguages] = useState([]);
  const [languageAId, setLanguageAId] = useState(null);
  const [languageBId, setLanguageBId] = useState(null);
  const [search, setSearch] = useState("");
  const [rowsA, setRowsA] = useState([]);
  const [rowsB, setRowsB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState({}); // `${resourceKey}:${languageId}` -> value
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    languageService.getLanguages().then((res) => {
      const items = res.data.items;
      setLanguages(items);
      const tr = items.find((l) => l.code === "tr") ?? items[0];
      const en = items.find((l) => l.code === "en") ?? items[1];
      setLanguageAId(tr?.id);
      setLanguageBId(en?.id ?? items[1]?.id);
    });
  }, []);

  const fetchRows = useCallback(async () => {
    if (!languageAId) return;
    setLoading(true);
    try {
      const [resA, resB] = await Promise.all([
        translationService.getTranslations({ languageId: languageAId, resourceKey: search }),
        languageBId
          ? translationService.getTranslations({ languageId: languageBId, resourceKey: search })
          : Promise.resolve({ data: { items: [] } }),
      ]);
      setRowsA(resA.data.items);
      setRowsB(resB.data.items);
    } finally {
      setLoading(false);
    }
  }, [languageAId, languageBId, search]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const gridRows = useMemo(() => {
    const keys = new Set([...rowsA.map((r) => r.resourceKey), ...rowsB.map((r) => r.resourceKey)]);
    return Array.from(keys)
      .sort()
      .map((key) => {
        const a = rowsA.find((r) => r.resourceKey === key);
        const b = rowsB.find((r) => r.resourceKey === key);
        return {
          resourceKey: key,
          valueA: dirty[`${key}:${languageAId}`] ?? a?.value ?? "",
          valueB: dirty[`${key}:${languageBId}`] ?? b?.value ?? "",
          updatedAt: a?.updatedAt ?? b?.updatedAt,
        };
      });
  }, [rowsA, rowsB, dirty, languageAId, languageBId]);

  const setCellValue = useCallback((resourceKey, languageId, value) => {
    setDirty((prev) => ({ ...prev, [`${resourceKey}:${languageId}`]: value }));
  }, []);

  const dirtyCount = Object.keys(dirty).length;

  const saveAll = useCallback(async () => {
    setSaving(true);
    try {
      const items = Object.entries(dirty).map(([key, value]) => {
        const [resourceKey, languageId] = key.split(":");
        return { languageId: Number(languageId), resourceKey, value };
      });
      const result = await translationService.bulkUpdate(items);
      setDirty({});
      await fetchRows();
      return result;
    } finally {
      setSaving(false);
    }
  }, [dirty, fetchRows]);

  return {
    languages,
    languageAId,
    languageBId,
    setLanguageAId,
    setLanguageBId,
    search,
    setSearch,
    gridRows,
    loading,
    setCellValue,
    dirtyCount,
    saving,
    saveAll,
    refetch: fetchRows,
  };
}
