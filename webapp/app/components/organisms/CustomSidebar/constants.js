export const SIDEBAR_ITEMS = [
  {
    title: 'Extensions Deployment',
    key: 'extensions-deployment',
    path: 'extensions-deployment',
  },
  {
    title: 'Logs and Metrics',
    key: 'logs-metrics',
    children: [
      {
        title: 'Log Viewer',
        key: 'log-viewer',
        path: 'extensionLogViewer.html',
      },
      {
        title: 'Platform Metrics',
        key: 'platform-metrics',
        path: 'extensions-metrics',
      },
      {
        title: 'App Request Logs',
        key: 'app-request-logs',
        path: 'app-request-logs',
      },
      {
        title: 'Extensions Configurations',
        key: 'extensions-config',
        path: 'configManagement',
      },
      {
        title: 'B2C Gateway Config',
        key: 'b2c-gateway-config',
        path: 'migrationGateway',
      },
    ],
  },
  {
    title: 'DB Management',
    key: 'db-management',
    children: [
      {
        title: 'MongoDB Workbench',
        key: 'mongodb-workbench',
        path: 'mongodb-workbench',
      },
      {
        title: 'DB Audit Log',
        key: 'db-audit-log',
        path: 'db-audit-log',
      },
    ],
  },
  {
    title: 'Alert Management',
    key: 'alert-management',
    children: [
      {
        title: 'Bugsnag',
        key: 'bugsnag',
        children: [
          {
            title: 'Issues',
            key: 'bugsnag-issues',
            path: 'alert-management/bugsnag/issues',
          },
          {
            title: 'Configuration',
            key: 'bugsnag-config',
            path: 'alert-management/bugsnag/configuration',
          },
        ],
      },
      {
        title: 'New Relic',
        key: 'new-relic',
        children: [
          {
            title: 'Issues',
            key: 'newrelic-issues',
            path: 'alert-management/backend/issues',
          },
          {
            title: 'Configurations',
            key: 'newrelic-config',
            path: 'alert-management/backend/configurations',
          },
        ],
      },
    ],
  },
  {
    title: 'Neo Debugger',
    key: 'neo-debugger',
    path: 'neo-debugger',
  },
];