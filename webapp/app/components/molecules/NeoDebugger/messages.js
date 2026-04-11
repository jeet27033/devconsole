import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.molecules.NeoDebugger';

export default defineMessages({
  pageTitle: {
    id: `${scope}.pageTitle`,
    defaultMessage: 'Neo Debugger Chrome Extension',
  },
  pageSubtitle: {
    id: `${scope}.pageSubtitle`,
    defaultMessage: 'Simplify your logging workflow with our powerful developer tool',
  },
  keyFeatures: {
    id: `${scope}.keyFeatures`,
    defaultMessage: 'Key Features',
  },
  responseAnalysisTitle: {
    id: `${scope}.responseAnalysisTitle`,
    defaultMessage: 'Response Analysis',
  },
  responseAnalysisDesc: {
    id: `${scope}.responseAnalysisDesc`,
    defaultMessage:
      'View detailed API responses including headers, body content, and status codes with syntax highlighting.',
  },
  comprehensiveLoggingTitle: {
    id: `${scope}.comprehensiveLoggingTitle`,
    defaultMessage: 'Comprehensive Logging',
  },
  comprehensiveLoggingDesc: {
    id: `${scope}.comprehensiveLoggingDesc`,
    defaultMessage:
      'Access and filter detailed logs with support for different log levels (info, error, warning, debug).',
  },
  logInsightsTitle: {
    id: `${scope}.logInsightsTitle`,
    defaultMessage: 'Log Insights',
  },
  logInsightsDesc: {
    id: `${scope}.logInsightsDesc`,
    defaultMessage:
      'Automatically analyze logs to identify patterns, errors, and execution flow with visual representations.',
  },
  blockIOTitle: {
    id: `${scope}.blockIOTitle`,
    defaultMessage: 'Block I/O Visualization',
  },
  blockIODesc: {
    id: `${scope}.blockIODesc`,
    defaultMessage:
      'Monitor input/output data flow between blocks in your API requests with a clear visual timeline.',
  },
  authManagementTitle: {
    id: `${scope}.authManagementTitle`,
    defaultMessage: 'Authentication Management',
  },
  authManagementDesc: {
    id: `${scope}.authManagementDesc`,
    defaultMessage:
      'Securely store and manage authentication credentials with support for Basic Auth and OAuth.',
  },
  blockInspectorTitle: {
    id: `${scope}.blockInspectorTitle`,
    defaultMessage: 'Block Inspector Terminal',
  },
  blockInspectorDesc: {
    id: `${scope}.blockInspectorDesc`,
    defaultMessage:
      'Interactive JavaScript console to inspect and manipulate response data with autocomplete functionality.',
  },
  installExtension: {
    id: `${scope}.installExtension`,
    defaultMessage: 'Install Neo Debugger Extension',
  },
  needHelp: {
    id: `${scope}.needHelp`,
    defaultMessage: 'Need Help?',
  },
  contactSupport: {
    id: `${scope}.contactSupport`,
    defaultMessage:
      'If you are experiencing issues with the extension or have questions, please contact the FT Extension Team.',
  },
  docsInfo: {
    id: `${scope}.docsInfo`,
    defaultMessage: 'For detailed instructions and documentation, visit our',
  },
  docsLink: {
    id: `${scope}.docsLink`,
    defaultMessage: 'Neo Debugger Documentation',
  },
});
