import Modal from '../../../components/Modal';
import Label from '../../signup/atoms/Label';
import PasswordInputWithToggle from '../../signup/molecules/PasswordInputWithToggle';
import ConfirmPasswordInputSection from '../../signup/organisms/ConfirmPasswordInputSection';
import PasswordInputSection from '../../signup/organisms/PasswordInputSection';
import CancelConfirmActions from '../molecules/CancelConfirmActions';

const PasswordChangeModal = ({
  isOpen,
  onClose,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  newPasswordRequirements,
  confirmPasswordRequirements,
  handleChangePassword
}) => {
  if (!isOpen) return null;

  return (
    <Modal 
      onClose={onClose}
      title="비밀번호 변경"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="current-password">현재 비밀번호</Label>
          <PasswordInputWithToggle
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        
        <PasswordInputSection
          label="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          requirements={newPasswordRequirements}
        />
        
        <ConfirmPasswordInputSection
          label="새 비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          requirements={confirmPasswordRequirements}
          error={passwordError}
        />

        <CancelConfirmActions 
          onCancel={onClose} 
          onConfirm={handleChangePassword} 
          confirmText="변경하기" 
        />
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
