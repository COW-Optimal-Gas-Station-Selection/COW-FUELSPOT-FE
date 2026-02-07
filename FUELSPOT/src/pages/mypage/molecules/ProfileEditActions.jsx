import Button from '../../../components/Button';

export default function ProfileEditActions({ onUpdate }) {
  return (
    <div className="pt-4">
      <Button onClick={onUpdate} variant="primary" className="w-full h-12 text-base font-bold">
        정보 수정하기
      </Button>
    </div>
  );
}
