import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.MongodbWorkbench';

export default defineMessages({
  pageTitle: {
    id: `${scope}.pageTitle`,
    defaultMessage: 'MongoDB Workbench',
  },
  selectDatabase: {
    id: `${scope}.selectDatabase`,
    defaultMessage: 'Select Database',
  },
  selectDatabasePlaceholder: {
    id: `${scope}.selectDatabasePlaceholder`,
    defaultMessage: 'Select a database',
  },
  selectCollection: {
    id: `${scope}.selectCollection`,
    defaultMessage: 'Select Collection',
  },
  selectCollectionPlaceholder: {
    id: `${scope}.selectCollectionPlaceholder`,
    defaultMessage: 'Select a collection',
  },
  writeQuery: {
    id: `${scope}.writeQuery`,
    defaultMessage: 'Write Query',
  },
  queryPlaceholder: {
    id: `${scope}.queryPlaceholder`,
    defaultMessage: 'e.g., db.collection.find({ age: 25 }).limit(1)',
  },
  runQuery: {
    id: `${scope}.runQuery`,
    defaultMessage: 'Run Query',
  },
  loadSchema: {
    id: `${scope}.loadSchema`,
    defaultMessage: 'Load Schema',
  },
  explain: {
    id: `${scope}.explain`,
    defaultMessage: 'Explain',
  },
  response: {
    id: `${scope}.response`,
    defaultMessage: 'Response',
  },
  executionTime: {
    id: `${scope}.executionTime`,
    defaultMessage: 'Execution Time: {time}ms',
  },
  syntaxNoticeTitle: {
    id: `${scope}.syntaxNoticeTitle`,
    defaultMessage: 'Notice:',
  },
  syntaxNoticeBody: {
    id: `${scope}.syntaxNoticeBody`,
    defaultMessage: 'MongoDB workbench now supports standard MongoDB Shell syntax for all query operations.',
  },
  syntaxNoticeLink: {
    id: `${scope}.syntaxNoticeLink`,
    defaultMessage: 'MongoDB Shell Documentation',
  },
  noResponse: {
    id: `${scope}.noResponse`,
    defaultMessage: 'Run a query to see results here.',
  },
});
