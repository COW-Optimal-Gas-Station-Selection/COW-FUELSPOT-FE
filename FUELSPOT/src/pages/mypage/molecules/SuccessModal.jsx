import Button from '../../../components/Button'
import Modal from '../../../components/Modal'

function SuccessModal({ open, onClose }) {
  if (!open) return null
  return (
    <Modal onClose={onClose} title="수정 성공">
      <div className="text-center">
        <p className="text-gray-600 mb-6">회원 정보가 성공적으로 수정되었습니다.</p>
        <Button onClick={onClose} variant="primary" className="w-full">
          확인
        </Button>
      </div>
    </Modal>
  )
}

export default SuccessModal
