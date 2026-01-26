import Button from '../../../components/Button'
import Modal from '../../../components/Modal'

function ErrorModal({ open, onClose, errorMessage }) {
  if (!open) return null
  return (
    <Modal onClose={onClose} title="오류 발생">
      <div className="text-center">
        <p className="text-red-500 mb-6">{errorMessage}</p>
        <Button onClick={onClose} variant="primary" className="w-full">
          확인
        </Button>
      </div>
    </Modal>
  )
}

export default ErrorModal
