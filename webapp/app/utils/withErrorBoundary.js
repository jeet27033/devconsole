import { ErrorBoundaryDefault } from '@capillarytech/vulcan-react-sdk/components';
import React from 'react';

import ErrorBoundary from '../components/organisms/ErrorBoundary';

const withErrorBoundary = (WrappedComponent, FallbackComponent = ErrorBoundaryDefault) => {
  const ComponentWithErrorBoundary = (props) => (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithErrorBoundary;
};

export default withErrorBoundary;
