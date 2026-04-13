export const DURATION_OPTIONS = [
  { value: '5M', label: '5 Minutes' },
  { value: '30M', label: '30 Minutes' },
  { value: '1H', label: '1 Hour' },
  { value: '6H', label: '6 Hours' },
  { value: '24H', label: '24 Hours' },
  { value: '3D', label: '3 Days' },
  { value: '7D', label: '7 Days' },
  { value: '30D', label: '30 Days' },
];

export const DEFAULT_DURATION = '1H';

export const CHART_TYPES = {
  SCALER: 'scaler',
  LINE: 'line',
  TABLE: 'table',
};

export const DEMO_CHARTS = [
  {
    id: 1,
    name: 'Total Requests (ABS)',
    type: 'scaler',
    value: 1284503,
    unit: '',
  },
  {
    id: 2,
    name: 'Error Percentage',
    type: 'scaler',
    value: 2.34,
    unit: '%',
  },
  {
    id: 3,
    name: 'Latency in ms P(95)',
    type: 'scaler',
    value: 187.42,
    unit: 'ms',
  },
  {
    id: 4,
    name: 'Throughput',
    type: 'line',
    data: [
      { timestamp: '10:00', 'Requests/min': 1520, 'Avg Throughput': 1400 },
      { timestamp: '10:05', 'Requests/min': 1680, 'Avg Throughput': 1450 },
      { timestamp: '10:10', 'Requests/min': 1450, 'Avg Throughput': 1430 },
      { timestamp: '10:15', 'Requests/min': 1890, 'Avg Throughput': 1500 },
      { timestamp: '10:20', 'Requests/min': 2100, 'Avg Throughput': 1560 },
      { timestamp: '10:25', 'Requests/min': 1950, 'Avg Throughput': 1580 },
      { timestamp: '10:30', 'Requests/min': 1760, 'Avg Throughput': 1540 },
      { timestamp: '10:35', 'Requests/min': 2050, 'Avg Throughput': 1600 },
      { timestamp: '10:40', 'Requests/min': 1830, 'Avg Throughput': 1570 },
      { timestamp: '10:45', 'Requests/min': 1920, 'Avg Throughput': 1590 },
    ],
  },
  {
    id: 5,
    name: 'Percentile',
    type: 'line',
    data: [
      { timestamp: '10:00', 'P50 (ms)': 45, 'P90 (ms)': 120, 'P95 (ms)': 185, 'P99 (ms)': 450 },
      { timestamp: '10:05', 'P50 (ms)': 42, 'P90 (ms)': 115, 'P95 (ms)': 178, 'P99 (ms)': 420 },
      { timestamp: '10:10', 'P50 (ms)': 48, 'P90 (ms)': 130, 'P95 (ms)': 195, 'P99 (ms)': 510 },
      { timestamp: '10:15', 'P50 (ms)': 50, 'P90 (ms)': 140, 'P95 (ms)': 210, 'P99 (ms)': 580 },
      { timestamp: '10:20', 'P50 (ms)': 47, 'P90 (ms)': 125, 'P95 (ms)': 190, 'P99 (ms)': 470 },
      { timestamp: '10:25', 'P50 (ms)': 44, 'P90 (ms)': 118, 'P95 (ms)': 182, 'P99 (ms)': 430 },
      { timestamp: '10:30', 'P50 (ms)': 46, 'P90 (ms)': 122, 'P95 (ms)': 187, 'P99 (ms)': 455 },
      { timestamp: '10:35', 'P50 (ms)': 43, 'P90 (ms)': 116, 'P95 (ms)': 180, 'P99 (ms)': 425 },
    ],
  },
  {
    id: 6,
    name: 'Error Percentage Trend',
    type: 'line',
    data: [
      { timestamp: '10:00', 'Error %': 1.8 },
      { timestamp: '10:05', 'Error %': 2.1 },
      { timestamp: '10:10', 'Error %': 3.5 },
      { timestamp: '10:15', 'Error %': 4.2 },
      { timestamp: '10:20', 'Error %': 2.8 },
      { timestamp: '10:25', 'Error %': 2.3 },
      { timestamp: '10:30', 'Error %': 1.9 },
      { timestamp: '10:35', 'Error %': 2.0 },
      { timestamp: '10:40', 'Error %': 1.7 },
      { timestamp: '10:45', 'Error %': 2.4 },
    ],
  },
  {
    id: 7,
    name: 'Requests Per Status Code',
    type: 'table',
    columns: ['Status Code', 'Count', 'Percentage'],
    rows: [
      ['200', '1,182,543', '92.06%'],
      ['201', '38,412', '2.99%'],
      ['304', '21,305', '1.66%'],
      ['400', '15,823', '1.23%'],
      ['401', '8,412', '0.65%'],
      ['403', '3,201', '0.25%'],
      ['404', '7,654', '0.60%'],
      ['500', '5,842', '0.45%'],
      ['502', '987', '0.08%'],
      ['503', '324', '0.03%'],
    ],
  },
  {
    id: 8,
    name: 'Requests Per Request Uri',
    type: 'table',
    columns: ['Request URI', 'Count', 'Avg Duration (ms)'],
    rows: [
      ['/api/v2/loyalty/points', '245,120', '45.2'],
      ['/api/v2/members/lookup', '198,430', '32.8'],
      ['/api/v2/campaigns/active', '156,780', '78.5'],
      ['/api/v2/transactions/process', '134,560', '125.3'],
      ['/api/v2/coupons/validate', '98,240', '56.1'],
      ['/api/v2/tiers/calculate', '87,430', '210.4'],
      ['/api/v2/notifications/send', '76,890', '89.7'],
      ['/api/v2/reports/summary', '45,230', '340.2'],
    ],
  },
  {
    id: 9,
    name: 'Parent Api Calls',
    type: 'table',
    columns: ['API', 'Count', 'Avg Duration (ms)'],
    rows: [
      ['Loyalty Engine Core', '523,450', '62.3'],
      ['Member Service', '312,890', '45.1'],
      ['Campaign Manager', '245,670', '98.7'],
      ['Transaction Processor', '198,340', '135.2'],
      ['Notification Service', '156,780', '72.4'],
      ['Tier Calculator', '87,430', '215.6'],
      ['Analytics Pipeline', '45,230', '342.8'],
    ],
  },
];

export const CHART_COLORS = [
  '#FFC300',
  '#FF5733',
  '#702dff',
  '#BCFF2D',
  '#33DBFF',
  '#C70039',
  '#bf2dff',
  '#27bcd8',
  '#d1892e',
  '#57c13e',
];

export const DUMMY_PRODUCTS = [
  { value: '', label: 'Select Product' },
  { value: 'loyalty-engine', label: 'Loyalty Engine' },
  { value: 'campaign-manager', label: 'Campaign Manager' },
  { value: 'engage-plus', label: 'Engage+' },
  { value: 'insights-plus', label: 'Insights+' },
  { value: 'connect-plus', label: 'Connect Plus' },
];

export const DUMMY_DASHBOARDS = [
  { value: '', label: 'Select Dashboard' },
  { value: 'CAPILLARY_CORE_PLATFORM', label: 'Capillary Core Platform' },
  { value: 'GATEWAY_METRICS', label: 'Gateway Metrics' },
  { value: 'PERFORMANCE_METRICS', label: 'Performance Metrics' },
  { value: 'API_GATEWAY', label: 'API Gateway' },
];
