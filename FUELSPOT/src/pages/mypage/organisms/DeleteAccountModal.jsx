import Modal from '../../../components/Modal';
import CancelConfirmActions from '../molecules/CancelConfirmActions';

const DeleteAccountModal = ({
  isOpen,
  onClose,
  handleDeleteAccount
}) => {
  if (!isOpen) return null;

  return (
    <Modal 
      onClose={onClose}
      title="계정 탈퇴 경고"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 text-sm font-bold leading-relaxed">
          정말로 주유스팟을 탈퇴하시겠습니까?<br/>
          계정 삭제 시 즐겨찾기 목록과 모든 설정 정보가<br/>
          <span className="text-red-900 underline">영구적으로 삭제되며 복구할 수 없습니다.</span>
        </div>
        
        <CancelConfirmActions 
          onCancel={onClose} 
          onConfirm={handleDeleteAccount} 
          confirmText="탈퇴하기" 
          cancelVariant="primary"
          confirmVariant="error-outline"
        />
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
