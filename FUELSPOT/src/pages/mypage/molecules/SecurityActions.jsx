import Button from '../../../components/Button';

export default function SecurityActions({ onPasswordChange, onDeleteAccount }) {
  return (
    <div className="pt-6 flex flex-col gap-3">
      <Button 
        onClick={onPasswordChange} 
        variant="outline" 
        className="w-full h-12 text-base font-bold text-blue-600 border-blue-100 hover:bg-blue-50"
      >
        비밀번호 변경하기
      </Button>

      <div className="pt-8 border-t border-gray-100 flex justify-center">
        <button 
          onClick={onDeleteAccount}
          className="text-gray-400 text-sm font-medium hover:text-red-500 hover:underline transition-all"
        >
          회원 탈퇴하기
        </button>
      </div>
    </div>
  );
}
