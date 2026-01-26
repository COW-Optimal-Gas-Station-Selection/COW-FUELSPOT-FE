import Button from '../../../components/Button'
import FuelspotLogo from '../../../components/FuelspotLogo'
import Modal from '../../../components/Modal'

function DeleteConfirmModal({ open, onClose, onDelete }) {
  if (!open) return null
  return (
    <Modal onClose={onClose} title="회원 탈퇴">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FuelspotLogo className="h-16" />
        </div>
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium">
          정말로 탈퇴하시겠습니까? <br />
          즐겨찾기 목록을 포함한 모든 정보가 삭제됩니다.
        </div>
        <div className="flex gap-3">
          <Button onClick={onClose} variant="primary" className="flex-1">
            취소
          </Button>
          <Button onClick={onDelete} variant="error-outline" className="flex-1">
            탈퇴하기
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal
