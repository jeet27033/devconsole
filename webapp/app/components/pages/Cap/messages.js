/*
 * Cap Messages
 *
 * This contains all the text for the Cap container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.pages.Cap';

export default defineMessages({
  home: {
    id: `${scope}.home`,
    defaultMessage: 'Home page',
  },
  dashboard: {
    id: `${scope}.dashboard`,
    defaultMessage: 'Dashboard',
  },
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Cap container!',
  },
  errorMessage: {
    id: `${scope}.errorMessage`,
    defaultMessage: 'Something went wrong!',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  select: {
    id: `${scope}.select`,
    defaultMessage: 'Select',
  },
  noResultsFound: {
    id: `${scope}.noResultsFound`,
    defaultMessage: 'No results found',
  },
  search: {
    id: `${scope}.search`,
    defaultMessage: 'Search',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  areYouSureText: {
    id: `${scope}.areYouSureText`,
    defaultMessage: 'Are you sure?',
  },
  changeOk: {
    id: `${scope}.changeOk`,
    defaultMessage: 'Ok, change',
  },
  done: {
    id: `${scope}.done`,
    defaultMessage: 'Done',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  confirm: {
    id: `${scope}.confirm`,
    defaultMessage: 'Confirm',
  },
  somethingWentWrongTitle: {
    id: `${scope}.somethingWentWrongTitle`,
    defaultMessage: 'Something went wrong',
  },
  somethingWentWrongDesc: {
    id: `${scope}.somethingWentWrongDesc`,
    defaultMessage: 'An unexpected error occurred. Please try again.',
  },
  tryRefreshing: {
    id: `${scope}.tryRefreshing`,
    defaultMessage: 'Try refreshing',
  },
});
