// test-utils.js
import React from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

function Wrapper({ children }) {
  return <IntlProvider locale="en">{children}</IntlProvider>;
}
Wrapper.propTypes = {
  children: PropTypes.array,
};

function render(ui, renderOptions = {}) {
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

function renderWithRouter(
  Component,
  props,
  { routePath = '/', historyPush = '/' } = {},
  renderOptions,
) {
  const history = createMemoryHistory();
  history.push(historyPush);

  return {
    history,
    ...rtlRender(
      <Router history={history}>
        <Route
          path={routePath}
          render={routeProps => <Component {...props} {...routeProps} />}
        />
      </Router>,
      { wrapper: Wrapper, ...renderOptions },
    ),
  };
}

// re-export everything
export * from '@testing-library/react';

/**
 * Custom text matcher to find element if text is broken/made up of multiple elements.
 * @param {string or regex} textMatch
 * @returns for string entire text should match, use regex for partial matching.
 */
export function textContentMatcher(textMatch) {
  return function(_content, node) {
    const hasText = node =>
      node.textContent === textMatch || node.textContent.match(textMatch);
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      child => !hasText(child),
    );
    return nodeHasText && childrenDontHaveText;
  };
}

// override render method
export { render, renderWithRouter };
