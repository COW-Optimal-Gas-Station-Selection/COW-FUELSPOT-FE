import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';

export default function ProfileEditActions({ onUpdate }) {
  const navigate = useNavigate();
  return (
    <div className="pt-4 flex flex-col sm:flex-row gap-3">
      <Button onClick={onUpdate} variant="primary" className="flex-1 h-14 text-lg font-bold">
        정보 수정하기
      </Button>

    </div>
  );
}
