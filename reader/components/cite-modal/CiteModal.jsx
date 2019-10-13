import React from 'react'
import { Button, ModalBody } from 'reactstrap'
import Modal from '../modal/Modal'
import './CiteModal.scss'
import citationGenerator from './citations-generator'
import { useGlobalStore } from '../../store'
import { toggleCiteModal } from '../../store/ui/actions'

const CiteModal = () => {
  const [{ ui, metadata }, dispatch] = useGlobalStore()

  return (
    <Modal
      isOpen={ui.isCiteModalOpen}
      toggle={() => dispatch(toggleCiteModal())}
      onClose={() => dispatch(toggleCiteModal())}
      className="cite-modal"
    >
      <ModalBody>
        <div className="cite-row">
          <div className="cite-norm-name">MLA</div>
          <div className="cite-norm-text">
            {citationGenerator.generateMLACitation(metadata)}
          </div>
        </div>
        <div className="cite-row">
          <div className="cite-norm-name">APA</div>
          <div className="cite-norm-text">
            {citationGenerator.generateAPACitation(metadata)}
          </div>
        </div>
        <div className="cite-row">
          <div className="cite-norm-name">ISO 690</div>
          <div className="cite-norm-text">
            {citationGenerator.generateISO690Citation(metadata)}
          </div>
        </div>
        <div className="d-flex justify-content-center mt-2">
          <Button className="m-2 cite-export-button" color="none">
            BibTeX
          </Button>
          <Button className="m-2 cite-export-button" color="none">
            EndNote
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CiteModal
