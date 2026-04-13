import React, { useState, useCallback } from 'react';
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

import DateAndTimePicker from '../../molecules/DateAndTimePicker';
import styles from './styles';
import messages from './messages';
import {
  DURATION_OPTIONS,
  DEFAULT_DURATION,
  DEMO_CHARTS,
  CHART_COLORS,
  DUMMY_PRODUCTS,
  DUMMY_DASHBOARDS,
} from './constants';

const ScalerChart = ({ value, unit }) => (
  <div className="scaler-value">
    {typeof value === 'number' ? value.toLocaleString() : value || 0}
    {unit && <span className="scaler-unit">{unit}</span>}
  </div>
);

const LineChartWidget = ({ data, colors }) => {
  if (!data || data.length === 0) {
    return <div style={{ color: '#999', fontSize: '0.875rem' }}>No data available</div>;
  }

  const keys = Object.keys(data[0] || {}).filter((k) => k !== 'timestamp');

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Legend />
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
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <table className="metrics-table">
      <thead>
        <tr>
          {(columns || []).map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(rows || []).length === 0 ? (
          <tr>
            <td colSpan={columns?.length || 1} style={{ textAlign: 'center', color: '#999' }}>
              No data available
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const PlatformMetrics = ({ className, intl: { formatMessage } }) => {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [products] = useState(DUMMY_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState('loyalty-engine');
  const [dashboards] = useState(DUMMY_DASHBOARDS);
  const [selectedDashboard, setSelectedDashboard] = useState('CAPILLARY_CORE_PLATFORM');
  const [charts] = useState(DEMO_CHARTS);
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    // API call placeholder
    setTimeout(() => setLoading(false), 500);
  }, [selectedProduct, selectedDashboard, duration]);

  const handleDateApply = useCallback((range) => {
    setDateRange(range);
  }, []);

  const getCardClass = (chart) => {
    if (chart.type === 'table') return 'chart-card full-width';
    if (chart.type === 'line') return 'chart-card wide';
    return 'chart-card scaler';
  };

  const getBodyClass = (chart) => {
    if (chart.type === 'scaler') return 'chart-body scaler-body';
    if (chart.type === 'line') return 'chart-body line-body';
    if (chart.type === 'table') return 'chart-body table-body';
    return 'chart-body';
  };

  const renderChart = (chart) => {
    switch (chart.type) {
      case 'scaler':
        return <ScalerChart value={chart.value} unit={chart.unit} />;
      case 'line':
        return <LineChartWidget data={chart.data} colors={CHART_COLORS} />;
      case 'table':
        return <TableChart columns={chart.columns} rows={chart.rows} />;
      default:
        return null;
    }
  };

  return (
    <CapRow className={`${className} platform-metrics`}>
      <CapColumn span={24}>
        <div className="control-panel">
          <CapIcon type="reload" size="l" className={"reloadMatrix"} />
          <DateAndTimePicker onApply={handleDateApply} />
          <CapSelect
            className="product-select"
            options={products}
            value={selectedProduct}
            onChange={setSelectedProduct}
            placeholder={formatMessage(messages.selectProduct)}
          />
          <CapSelect
            className="dashboard-select"
            options={dashboards}
            value={selectedDashboard}
            onChange={setSelectedDashboard}
            placeholder={formatMessage(messages.selectDashboard)}
          />
        </div>

        {tabs.length > 0 && (
          <div className="dashboard-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {loading && <CapSpin />}

        {!loading && !selectedProduct && (
          <div className="empty-state">
            {formatMessage(messages.noDataAvailable)}
          </div>
        )}

        {!loading && selectedProduct && (
          <div className="dashboard-grid">
            {charts.map((chart) => (
              <div key={chart.id} className={getCardClass(chart)}>
                <div className="chart-header">{chart.name}</div>
                <div className={getBodyClass(chart)}>{renderChart(chart)}</div>
              </div>
            ))}
          </div>
        )}
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(PlatformMetrics, styles));
