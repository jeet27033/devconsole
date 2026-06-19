import React, { useState, useCallback, useEffect, useRef } from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import {
  CapRow,
  CapColumn,
  CapSelect,
  CapButton,
} from '@capillarytech/cap-ui-library';
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import styles from './styles';
import messages from './messages';
import { CHART_COLORS, DURATION_OPTIONS, DEFAULT_DURATION } from './constants';
import {
  getNewRelicMetricProducts,
  getNewRelicMetricDashboards,
  getNewRelicDashboardPages,
  executeNewRelicNrql,
} from '../../../services/api';

// ── Helpers ──────────────────────────────────────────────────────────────────

const dashboardDisplayName = (name) =>
  String(name)
    .replace(/[_-]/g, ' ')
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const durationToNrql = (dur) => {
  const map = {
    '5M': 'SINCE 5 minutes ago',
    '30M': 'SINCE 30 minutes ago',
    '1H': 'SINCE 1 hour ago',
    '6H': 'SINCE 6 hours ago',
    '24H': 'SINCE 24 hours ago',
    '3D': 'SINCE 3 days ago',
    '7D': 'SINCE 7 days ago',
    '30D': 'SINCE 30 days ago',
  };
  return { since: map[dur] || 'SINCE 1 hour ago', until: 'UNTIL NOW' };
};

// ── No-data state ─────────────────────────────────────────────────────────────

const NoDataState = () => (
  <div className="no-data-state">
    <span className="no-data-icon">⚠</span>
    <span className="no-data-label">No data available</span>
  </div>
);

// ── Chart renderers ───────────────────────────────────────────────────────────

const ScalerChart = ({ value, unit }) => (
  <div className="scaler-value">
    {typeof value === 'number' ? value.toLocaleString() : (value ?? '–')}
    {unit && <span className="scaler-unit">{unit}</span>}
  </div>
);

const LineChartWidget = ({ data, colors }) => {
  if (!data || data.length === 0) return <NoDataState />;
  const keys = Object.keys(data[0] || {}).filter(
    (k) => k !== 'timestamp' && k !== 'beginTimeSeconds' && k !== 'endTimeSeconds',
  );
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} width={40} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {keys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i % colors.length]}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

const TableChart = ({ columns, rows }) => (
  <div style={{ width: '100%', overflowX: 'auto', maxHeight: '18rem', overflowY: 'auto' }}>
    <table className="metrics-table">
      <thead>
        <tr>{(columns || []).map((col) => <th key={col}>{col}</th>)}</tr>
      </thead>
      <tbody>
        {!(rows || []).length ? (
          <tr>
            <td colSpan={columns?.length || 1}><NoDataState /></td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// ── NRQL result parser ────────────────────────────────────────────────────────

const parseNrqlResults = (nrData) => {
  if (!nrData) return null;

  const results = nrData.results ?? [];
  const facets = nrData.facets ?? [];
  const timeSeries = nrData.timeSeries ?? [];
  const metadata = nrData.metadata ?? {};

  // Timeseries
  if (timeSeries.length > 0) {
    const contents = metadata?.timeSeries?.contents ?? metadata?.contents ?? [];
    const keys = contents.map((c, i) => c.alias || c.function || `series${i}`);
    const data = timeSeries.map((point) => {
      const ts = new Date(point.beginTimeSeconds * 1000);
      const label = `${ts.getHours()}:${String(ts.getMinutes()).padStart(2, '0')}`;
      const row = { timestamp: label };
      (point.results || []).forEach((r, i) => {
        row[keys[i] || `s${i}`] = typeof Object.values(r)[0] === 'number'
          ? Math.round(Object.values(r)[0] * 100) / 100
          : Object.values(r)[0];
      });
      return row;
    });
    return { type: 'line', data };
  }

  // Faceted table
  if (facets.length > 0) {
    const contents = metadata?.contents ?? [];
    const metricKeys = contents.map((c, i) => c.alias || c.function || `val${i}`);
    const facetNames = Array.isArray(facets[0]?.name) ? facets[0].name.map((_, i) => `facet${i}`) : ['name'];
    const columns = [...facetNames, ...metricKeys];
    const rows = facets.map((f) => {
      const nameArr = Array.isArray(f.name) ? f.name : [f.name];
      const vals = (f.results || []).map((r) => {
        const v = Object.values(r)[0];
        return typeof v === 'number' ? v.toLocaleString() : (v ?? '-');
      });
      return [...nameArr, ...vals];
    });
    return { type: 'table', columns, rows };
  }

  if (results.length === 0) return null;

  // Timeseries in results array
  if (results[0]?.beginTimeSeconds !== undefined) {
    const keys = Object.keys(results[0]).filter(
      (k) => k !== 'beginTimeSeconds' && k !== 'endTimeSeconds' && k !== 'inspectedCount',
    );
    const data = results.map((r) => {
      const ts = new Date(r.beginTimeSeconds * 1000);
      const label = `${ts.getHours()}:${String(ts.getMinutes()).padStart(2, '0')}`;
      const row = { timestamp: label };
      keys.forEach((k) => { row[k] = r[k]; });
      return row;
    });
    return { type: 'line', data };
  }

  // Scalar
  if (results.length === 1) {
    const keys = Object.keys(results[0]).filter(
      (k) => k !== 'beginTimeSeconds' && k !== 'endTimeSeconds' && k !== 'inspectedCount',
    );
    if (keys.length === 1) {
      const val = results[0][keys[0]];
      return { type: 'scaler', value: typeof val === 'number' ? Math.round(val * 100) / 100 : val };
    }
  }

  // Multi-row table
  const keys = Object.keys(results[0]);
  return {
    type: 'table',
    columns: keys,
    rows: results.map((r) =>
      keys.map((k) => {
        const v = r[k];
        return typeof v === 'number' ? v.toLocaleString() : (v ?? '-');
      }),
    ),
  };
};

// ── Chart card with per-card refresh + lazy load ──────────────────────────────

const ChartCard = ({ chart, duration }) => {
  const [data, setData] = useState({ ...chart, type: chart.type || 'loading' });
  const [loading, setLoading] = useState(false);
  const refreshBtnRef = useRef(null);
  const cardRef = useRef(null);
  const loadedRef = useRef(false);

  const loadChartData = useCallback(async () => {
    if (!chart.nrql) return;
    setLoading(true);
    try {
      const { since, until } = durationToNrql(duration);
      const res = await executeNewRelicNrql({ nrql: chart.nrql, since, until });
      const nrData = res?.data?.data ?? res?.data ?? null;
      const parsed = parseNrqlResults(nrData);
      setData(parsed ? { ...chart, ...parsed } : { ...chart, type: 'empty' });
    } catch {
      setData({ ...chart, type: 'empty' });
    } finally {
      setLoading(false);
    }
  }, [chart, duration]);

  // IntersectionObserver lazy loading
  useEffect(() => {
    if (!cardRef.current || !chart.nrql) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadedRef.current) {
          loadedRef.current = true;
          loadChartData();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [loadChartData, chart.nrql]);

  const handleCardRefresh = (e) => {
    e.stopPropagation();
    if (refreshBtnRef.current) {
      refreshBtnRef.current.style.transition = 'transform 0.4s ease';
      refreshBtnRef.current.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        if (refreshBtnRef.current) {
          refreshBtnRef.current.style.transition = '';
          refreshBtnRef.current.style.transform = '';
        }
      }, 420);
    }
    loadedRef.current = false;
    loadChartData();
  };

  const getCardClass = () => {
    if (data.type === 'table') return 'chart-card full-width';
    if (data.type === 'line') return 'chart-card wide';
    return 'chart-card scaler';
  };

  const getBodyClass = () => {
    if (data.type === 'table') return 'chart-body table-body';
    if (data.type === 'line') return 'chart-body line-body';
    return 'chart-body scaler-body';
  };

  const renderContent = () => {
    if (loading) return <CapSpin />;
    if (data.type === 'empty') return <NoDataState />;
    if (data.type === 'loading') return <NoDataState />;
    if (data.type === 'scaler') return <ScalerChart value={data.value} unit={data.unit} />;
    if (data.type === 'line') return <LineChartWidget data={data.data} colors={CHART_COLORS} />;
    if (data.type === 'table') return <TableChart columns={data.columns} rows={data.rows} />;
    return <NoDataState />;
  };

  return (
    <div ref={cardRef} className={getCardClass()}>
      <div className="chart-header">
        <span className="chart-header-title">{data.name}</span>
        {chart.nrql && (
          <span ref={refreshBtnRef} className="chart-refresh-btn" title="Refresh" onClick={handleCardRefresh}>
            <CapIcon type="reload" size="s" />
          </span>
        )}
      </div>
      <div className={getBodyClass()}>{renderContent()}</div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const PlatformMetrics = ({ className, intl: { formatMessage } }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(undefined);
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(undefined);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [charts, setCharts] = useState([]);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingDashboards, setLoadingDashboards] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [pendingFilter, setPendingFilter] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const reloadIconRef = useRef(null);
  const pagesRef = useRef([]);

  // ── Load products ─────────────────────────────────────────────────────────

  useEffect(() => {
    setLoadingProducts(true);
    getNewRelicMetricProducts()
      .then((res) => {
        const data = res?.data?.data ?? res?.data ?? [];
        setProducts(data.map((p) => ({ value: p.value, label: p.label })));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  // ── Load dashboards on product change ─────────────────────────────────────

  useEffect(() => {
    if (!selectedProduct) {
      setDashboards([]);
      setSelectedDashboard(undefined);
      setTabs([]);
      setCharts([]);
      return;
    }
    setLoadingDashboards(true);
    setCharts([]);
    setTabs([]);
    setSelectedDashboard(undefined);
    pagesRef.current = [];

    getNewRelicMetricDashboards(selectedProduct)
      .then((res) => {
        const data = res?.data?.data ?? res?.data ?? [];
        setDashboards(data.map((d) => ({ value: d.guid, label: d.name })));
      })
      .catch(() => setDashboards([]))
      .finally(() => setLoadingDashboards(false));
  }, [selectedProduct]);

  // ── Build chart stubs from a page's widgets ───────────────────────────────

  const buildChartsFromPage = useCallback((page) => {
    return (page?.widgets ?? [])
      .filter((w) => w.title && w.rawConfiguration?.nrqlQueries?.[0]?.query)
      .map((w, idx) => ({
        id: idx,
        name: w.title,
        type: 'loading',
        nrql: w.rawConfiguration.nrqlQueries[0].query,
      }));
  }, []);

  // ── Load dashboard pages + first tab ─────────────────────────────────────

  const loadDashboard = useCallback(async (guid) => {
    if (!guid) return;
    setLoadingCharts(true);
    setCharts([]);
    setTabs([]);
    pagesRef.current = [];

    try {
      const res = await getNewRelicDashboardPages(guid);
      const pages = res?.data?.data ?? res?.data ?? [];
      if (pages.length === 0) { setLoadingCharts(false); return; }

      pagesRef.current = pages;
      const tabNames = pages.map((p) => p.name);
      setTabs(tabNames);
      setActiveTab(tabNames[0]);
      setCharts(buildChartsFromPage(pages[0]));
    } catch { /* leave charts empty */ } finally {
      setLoadingCharts(false);
    }
  }, [buildChartsFromPage]);

  useEffect(() => {
    if (selectedDashboard) loadDashboard(selectedDashboard);
  }, [selectedDashboard]);

  // ── Tab switch ────────────────────────────────────────────────────────────

  const handleTabClick = useCallback((tabName) => {
    setActiveTab(tabName);
    const page = pagesRef.current.find((p) => p.name === tabName);
    if (page) setCharts(buildChartsFromPage(page));
  }, [buildChartsFromPage]);

  // ── Global refresh (remounts all ChartCards so they re-fetch) ─────────────

  const handleRefresh = useCallback(() => {
    if (reloadIconRef.current) {
      reloadIconRef.current.style.transition = 'transform 0.6s ease';
      reloadIconRef.current.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        if (reloadIconRef.current) {
          reloadIconRef.current.style.transition = '';
          reloadIconRef.current.style.transform = '';
        }
      }, 650);
    }
    setRefreshKey((k) => k + 1);
  }, []);

  // ── Duration change ───────────────────────────────────────────────────────

  const handleDurationChange = useCallback((val) => {
    setDuration(val);
    setRefreshKey((k) => k + 1);
  }, []);

  // ── Filter ────────────────────────────────────────────────────────────────

  const handleApplyFilter = () => setAppliedFilter(pendingFilter);
  const handleClearFilter = () => { setPendingFilter([]); setAppliedFilter([]); };

  const visibleCharts = appliedFilter.length > 0
    ? charts.filter((c) => appliedFilter.some((f) => c.name.toLowerCase().includes(f.toLowerCase())))
    : charts;

  // ── Render ────────────────────────────────────────────────────────────────

  const isLoading = loadingProducts || loadingDashboards || loadingCharts;

  return (
    <CapRow className={`${className} platform-metrics`}>
      <CapColumn span={24}>

        {/* Control panel */}
        <div className="control-panel">
          <div className="control-item">
            <span className="control-label">Duration</span>
            <CapSelect
              className="duration-select"
              options={DURATION_OPTIONS}
              value={duration}
              onChange={handleDurationChange}
              style={{width: '100%'}}
            />
          </div>

          <div className="control-item">
            <span className="control-label">Product</span>
            <CapSelect
              className="product-select"
              options={products}
              value={selectedProduct}
              onChange={setSelectedProduct}
              placeholder={formatMessage(messages.selectProduct)}
              loading={loadingProducts}
              style={{width: '100%'}}
            />
          </div>

          <div className="control-item">
            <span className="control-label">Dashboard</span>
            <CapSelect
              className="dashboard-select"
              options={dashboards}
              value={selectedDashboard}
              onChange={setSelectedDashboard}
              disabled={!selectedProduct || loadingDashboards}
              placeholder={formatMessage(messages.selectDashboard)}
              loading={loadingDashboards}
              style={{width: '100%'}}
            />
          </div>

          <span ref={reloadIconRef} onClick={handleRefresh} title={formatMessage(messages.refreshDashboard)}>
            <CapIcon type="reload" size="l" className="reloadMatrix" />
          </span>
        </div>

        {/* Dashboard tabs */}
        {tabs.length > 0 && (
          <div className="dashboard-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                {dashboardDisplayName(tab)}
              </button>
            ))}
          </div>
        )}

        {/* API filter bar — only when charts are loaded */}
        {charts.length > 0 && (
          <div className="filter-bar">
            <span className="filter-label">Filter APIs:</span>
            <CapSelect
              className="filter-select"
              mode="tags"
              value={pendingFilter}
              onChange={setPendingFilter}
              placeholder="Type to filter charts by name…"
              options={charts.map((c) => ({ value: c.name, label: c.name }))}
              allowClear
            />
            <CapButton type="primary" onClick={handleApplyFilter}>Apply</CapButton>
            {appliedFilter.length > 0 && (
              <CapButton onClick={handleClearFilter}>Clear</CapButton>
            )}
          </div>
        )}

        {/* Spinner */}
        {isLoading && (
          <div className="empty-state"><CapSpin /></div>
        )}

        {/* Prompt to select product */}
        {!isLoading && !selectedProduct && (
          <div className="empty-state">
            <span>{formatMessage(messages.noDataAvailable)}</span>
          </div>
        )}

        {/* Charts grid */}
        {!isLoading && visibleCharts.length > 0 && (
          <div className="dashboard-grid">
            {visibleCharts.map((chart) => (
              <ChartCard
                key={`${chart.id}-${refreshKey}`}
                chart={chart}
                duration={duration}
              />
            ))}
          </div>
        )}

        {/* Filter returned nothing */}
        {!isLoading && selectedProduct && charts.length > 0 && visibleCharts.length === 0 && (
          <div className="empty-state">
            <span className="no-data-icon">⚠</span>
            <span>No charts match the current filter.</span>
          </div>
        )}

      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(PlatformMetrics, styles));
