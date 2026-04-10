import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // min-height: 100vh;
  box-sizing: border-box;
  text-align: center;
`;

const Content = styled.section`
  width: 100%;
  box-sizing: border-box;
`;

const PageTemplate = ({ children, ...props }) => (
  <Wrapper {...props}>
    <Content>{children}</Content>
  </Wrapper>
);

PageTemplate.propTypes = {
  children: PropTypes.any.isRequired,
};

export default PageTemplate;
