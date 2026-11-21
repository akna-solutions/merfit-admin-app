import React, { useEffect, useRef, useState } from "react";
import { Badge, Checkbox, Col, Input, Rate, Select, Space, Tag, Typography } from "antd";
import { CheckCircleFilled, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DataTable, FilterBar, SectionCard, StatusTag } from "../../../components/admin";
import { useSafeListQuery } from "../hooks/useSafeListQuery";
import { storeProductService, storeReviewService } from "../services/storeService";
import { reviewFiltersToQuery } from "../utils/storeForms";
import { REVIEW_STATUS_COLORS, REVIEW_STATUS_LABELS } from "../utils/storeLabels";
import ListError from "./ListError";
import ReviewDetailDrawer from "./ReviewDetailDrawer";

const DEFAULT_FILTERS = { search: "", productId: undefined, rating: undefined, status: undefined, reportedOnly: false, verifiedPurchase: undefined };

const RATING_OPTIONS = [{ value: "all", label: "Tüm puanlar" }, ...[5, 4, 3, 2, 1].map((r) => ({ value: r, label: `${r} yıldız` }))];
const STATUS_OPTIONS = [
  { value: "all", label: "Silinmemiş tümü" },
  ...Object.entries(REVIEW_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];
const VERIFIED_OPTIONS = [
  { value: "all", label: "Tüm alışverişler" },
  { value: "yes", label: "Onaylı alışveriş" },
  { value: "no", label: "Onaysız" },
];

/** Ürün filtresi: sunucuda arama yapan seçim kutusu (tüm katalog yüklenmez). */
function ProductFilter({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const search = (text) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await storeProductService.getProducts({ search: text || undefined, pageSize: 20 });
        setOptions((response?.data?.items ?? []).map((p) => ({ value: p.id, label: p.name })));
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    search("");
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder="Tüm ürünler"
      filterOption={false}
      onSearch={search}
      loading={loading}
      value={value}
      onChange={(v) => onChange(v ?? undefined)}
      options={options}
      aria-label="Ürün"
    />
  );
}

export default function ReviewsTab() {
  const { rows, total, loading, error, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } = useSafeListQuery(
    storeReviewService.getReviews,
    DEFAULT_FILTERS,
    20,
    reviewFiltersToQuery,
  );
  const [openId, setOpenId] = useState(null);

  const columns = [
    {
      title: "Ürün",
      key: "product",
      width: 200,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.productName}</div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(r.createdAt).format("DD MMM YYYY HH:mm")}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Kullanıcı",
      key: "user",
      width: 200,
      render: (_, r) => (
        <div>
          <div>{r.userName ?? "—"}</div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {r.userEmail ?? `#${r.userId}`}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Puan",
      dataIndex: "rating",
      width: 130,
      render: (v) => <Rate disabled value={v} style={{ fontSize: 12 }} aria-label={`${v} yıldız`} />,
    },
    {
      title: "Yorum",
      key: "comment",
      render: (_, r) => (
        <div style={{ maxWidth: 360 }}>
          {r.title && <div style={{ fontWeight: 600 }}>{r.title}</div>}
          <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
            {r.comment}
          </Typography.Paragraph>
          <Space size={4} wrap>
            {r.isVerifiedPurchase && (
              <Tag color="blue" icon={<CheckCircleFilled />}>
                Onaylı alışveriş
              </Tag>
            )}
            {r.imageCount > 0 && <Tag>{r.imageCount} fotoğraf</Tag>}
          </Space>
        </div>
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      width: 110,
      render: (v) => (
        <StatusTag status={v} colorMap={REVIEW_STATUS_COLORS}>
          {REVIEW_STATUS_LABELS[v] ?? v}
        </StatusTag>
      ),
    },
    {
      title: "Rapor",
      key: "reports",
      width: 90,
      render: (_, r) =>
        r.openReportCount > 0 ? (
          <Badge count={r.openReportCount} title={`${r.openReportCount} açık rapor`} />
        ) : (
          <Typography.Text type="secondary">{r.reportCount > 0 ? `${r.reportCount} (kapalı)` : "—"}</Typography.Text>
        ),
    },
    { title: "Faydalı", dataIndex: "helpfulCount", width: 80 },
  ];

  return (
    <>
      <FilterBar onReset={resetFilters}>
        <Col xs={24} sm={12} lg={6}>
          <Input
            allowClear
            placeholder="Yorum, ürün, e-posta veya kullanıcı adı"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            aria-label="Yorum ara"
          />
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <ProductFilter value={filters.productId} onChange={(v) => updateFilters({ productId: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select
            style={{ width: "100%" }}
            value={filters.rating ?? "all"}
            onChange={(v) => updateFilters({ rating: v === "all" ? undefined : v })}
            options={RATING_OPTIONS}
            aria-label="Yıldız"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select
            style={{ width: "100%" }}
            value={filters.status ?? "all"}
            onChange={(v) => updateFilters({ status: v === "all" ? undefined : v })}
            options={STATUS_OPTIONS}
            aria-label="Yorum durumu"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select
            style={{ width: "100%" }}
            value={filters.verifiedPurchase ?? "all"}
            onChange={(v) => updateFilters({ verifiedPurchase: v === "all" ? undefined : v })}
            options={VERIFIED_OPTIONS}
            aria-label="Onaylı alışveriş"
          />
        </Col>
        <Col xs={12} sm={6} lg={4} style={{ display: "flex", alignItems: "center" }}>
          <Checkbox checked={filters.reportedOnly} onChange={(e) => updateFilters({ reportedOnly: e.target.checked })}>
            Yalnızca raporlananlar
          </Checkbox>
        </Col>
      </FilterBar>

      <SectionCard>
        <ListError error={error} onRetry={refetch} />
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1100}
          emptyDescription={error ? "Liste yüklenemedi." : "Filtrelerle eşleşen yorum yok."}
          onRow={(record) => ({ onClick: () => setOpenId(record.id), style: { cursor: "pointer" } })}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
        />
      </SectionCard>

      <ReviewDetailDrawer reviewId={openId} onClose={() => setOpenId(null)} onChanged={refetch} />
    </>
  );
}
