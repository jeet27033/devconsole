import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_08,
  CAP_SPACE_12,
  CAP_SPACE_16,
  CAP_SPACE_20,
  CAP_SPACE_24,
  CAP_SPACE_32,
  CAP_SPACE_40,
  CAP_G09,
  FONT_COLOR_01,
} = styledVars;

export default css`
  .extension-page {
    max-width: 56.25rem;
    margin: 0 auto;
    padding: ${CAP_SPACE_32} ${CAP_SPACE_24};
    color: ${FONT_COLOR_01};
  }

  /* Header */
  .extension-header {
    text-align: center;
    padding-bottom: ${CAP_SPACE_24};
    margin-bottom: ${CAP_SPACE_32};
    border-bottom: 0.0625rem solid #eaeaea;
  }

  .extension-header .cap-heading-v2 {
    margin-bottom: ${CAP_SPACE_08};
  }

  .extension-header .cap-label-v2 {
    display: block;
    color: #7f8c8d;
    font-size: 1.05rem;
  }

  /* Section titles */
  .section-title {
    text-align: center;
    margin-bottom: ${CAP_SPACE_24};
  }

  .section-title-icon {
    margin-right: ${CAP_SPACE_08};
    vertical-align: middle;
  }

  /* Feature cards grid */
  .feature-section {
    margin-bottom: ${CAP_SPACE_40};
  }

  .feature-card {
    background: ${CAP_G09};
    padding: ${CAP_SPACE_24};
    border-radius: 0.5rem;
    height: 100%;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    margin-bottom: ${CAP_SPACE_12};
  }

  .feature-icon .cap-icon-v2,
  .feature-icon .anticon {
    font-size: 1.75rem;
    color: #3498db;
  }

  .feature-card .cap-heading-v2 {
    margin-bottom: ${CAP_SPACE_08};
  }

  .feature-card .cap-label-v2 {
    display: block;
    color: #7f8c8d;
    line-height: 1.5;
  }

  /* Installation */
  .installation-section {
    text-align: center;
    padding: ${CAP_SPACE_32};
    border-radius: 0.5rem;
    margin-bottom: ${CAP_SPACE_32};
  }

  .installation-section .cap-heading-v2 {
    margin-bottom: ${CAP_SPACE_20};
  }

  .download-button {
    border-radius: 1.875rem;
    padding: 0 ${CAP_SPACE_32};
    height: 2.75rem;
    font-weight: 600;
  }

  .download-button .cap-icon-v2,
  .download-button .anticon {
    margin-right: ${CAP_SPACE_08};
    vertical-align: middle;
  }

  /* Support */
  .support-section {
    text-align: center;
  }

  .support-section .cap-heading-v2 {
    margin-bottom: ${CAP_SPACE_16};
  }

  .support-section .cap-label-v2 {
    display: block;
    margin-bottom: ${CAP_SPACE_08};
    color: #7f8c8d;
    line-height: 1.6;
  }

  .support-section a {
    color: #3498db;
    font-weight: 600;
  }

  .support-section a:hover {
    text-decoration: underline;
  }
`;
