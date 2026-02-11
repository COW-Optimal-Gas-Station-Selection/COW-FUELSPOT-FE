import { useState } from 'react';
import CarInputSection from '../../signup/organisms/CarInputSection';
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
  brand,
  setBrand,
  selectedCar,
  setSelectedCar,
  handleUpdate,
  setShowPasswordModal,
  setShowDeleteConfirmModal
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-300">
      {/* 아코디언 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 md:p-10 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
      >
        <div className="mb-0"> {/* MyPageTitle 내부의 mb-8을 상쇄하기 위해 mb-0 설정 */}
          <MyPageTitle title="회원 정보 수정" color="blue-600" />
        </div>
        <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* 아코디언 컨텐츠 */}
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-8 md:p-10 pt-0 border-t border-gray-50 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
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

            <div className="pt-4 border-t border-gray-50">
              <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">자동차 정보</h3>
              <CarInputSection
                brand={brand}
                model={selectedCar}
                onBrandChange={(val) => setBrand(val)}
                onModelChange={(car) => {
                  setSelectedCar(car)
                  if (car?.fuelType) {
                    setFuelType(car.fuelType)
                  }
                }}
              />
            </div>

            <ProfileEditActions onUpdate={handleUpdate} />

            <SecurityActions
              onPasswordChange={() => setShowPasswordModal(true)}
              onDeleteAccount={() => setShowDeleteConfirmModal(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileSection;
