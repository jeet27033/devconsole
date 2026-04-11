import React from "react";
import PropTypes from "prop-types";
import CapModal from "@capillarytech/cap-ui-library/CapModal";
import { CustomModalGlobalStyles } from "./style";

const WRAP_CLASS = "custom-modal-wrap";

const CustomModal = ({
  visible,
  onCancel,
  title,
  width,
  footer,
  closable,
  children,
  getContainer,
  className,
}) => (
  <>
    <CustomModalGlobalStyles />
    <CapModal
      title={title}
      visible={visible}
      onCancel={onCancel}
      closable={closable}
      footer={footer}
      width={width}
      style={{ maxWidth: width || 372 }}
      wrapClassName={WRAP_CLASS}
      className={className}
      getContainer={getContainer}
    >
      {children}
    </CapModal>
  </>
);

CustomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  footer: PropTypes.node,
  closable: PropTypes.bool,
  children: PropTypes.node,
  getContainer: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  className: PropTypes.string,
};

CustomModal.defaultProps = {
  closable: true,
  footer: undefined,
  width: 372,
  getContainer: undefined,
  className: "",
};

export default CustomModal;
