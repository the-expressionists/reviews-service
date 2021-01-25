import React, {useState} from 'react';
import PropTypes from 'prop-types';

const Modal = ({closer, element, className, opacity}) => {
  let style = {
    opacity,
    backgroundColor: '#0a0a0a',
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    top: '0px',
    left: '0px',
    right: '0px',
    zIndex: 1000
  };

  return (
    <div onClick={closer} className={className}>
      {element}
    </div>
  );
};

Modal.defaultProps = {
  className: 'modal-popup',
  opacity: 80
};

Modal.propTypes = {
  element: PropTypes.element.isRequired,
  closer: PropTypes.func.isRequired,
  className: PropTypes.string,
  opacity: PropTypes.number
};
export default Modal;
