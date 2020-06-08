import React from 'react'
import { Modal as RSModal } from 'reactstrap'
import { Button } from '@oacore/design'
import './Modal.scss'

const Modal = ({ children, isOpen, onClose, toggle }) => (
  <RSModal isOpen={isOpen} toggle={toggle}>
    <Button className="modal-button" onClick={onClose}>
      &times;
    </Button>
    {children}
  </RSModal>
)

export default Modal
