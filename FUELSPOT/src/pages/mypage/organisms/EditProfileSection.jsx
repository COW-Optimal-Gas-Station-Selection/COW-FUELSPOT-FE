import FuelTypeInputSection from '../../signup/organisms/FuelTypeInputSection';
import NameInputSection from '../../signup/organisms/NameInputSection';
import RadiusInputSection from '../../signup/organisms/RadiusInputSection';
import MyPageTitle from '../atoms/MyPageTitle';
import ProfileEditActions from '../molecules/ProfileEditActions';
import SecurityActions from '../molecules/SecurityActions';

const EditProfileSection = ({
  nickname,
  setNickname,
  nicknameError,
  nicknameRequirements,
  fuelType,
  setFuelType,
  fuelTypeError,
  radius,
  setRadius,
  radiusError,
  handleUpdate,
  setShowPasswordModal,
  setShowDeleteConfirmModal
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 border border-gray-100">
      <MyPageTitle title="회원 정보 수정" color="blue-600" />
      
      <div className="space-y-8">
        <NameInputSection
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={nicknameError}
          requirements={nicknameRequirements}
        />
        
        <FuelTypeInputSection
          value={fuelType}
          onChange={(val) => setFuelType(val)}
          error={fuelTypeError}
        />
        
        <RadiusInputSection
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          error={radiusError}
        />

        <ProfileEditActions onUpdate={handleUpdate} />

        <SecurityActions 
          onPasswordChange={() => setShowPasswordModal(true)} 
          onDeleteAccount={() => setShowDeleteConfirmModal(true)} 
        />
      </div>
    </div>
  );
};

export default EditProfileSection;
