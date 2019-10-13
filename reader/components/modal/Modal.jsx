import React from 'react'
import { Button, Modal as RSModal } from 'reactstrap'
import './Modal.scss'

const Modal = ({ children, isOpen, onClose, toggle, className = '' }) => (
  <RSModal isOpen={isOpen} toggle={toggle} className={className}>
    <Button color="none" className="modal-button" onClick={onClose}>
      &times;
    </Button>
    {children}
  </RSModal>
)

export default Modal
