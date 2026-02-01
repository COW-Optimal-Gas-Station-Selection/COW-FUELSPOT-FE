import Button from '../../../components/Button';

export default function CancelConfirmActions({ 
  onCancel, 
  onConfirm, 
  cancelText = "취소", 
  confirmText = "확인",
  cancelVariant = "outline",
  confirmVariant = "primary"
}) {
  return (
    <div className="flex gap-3 pt-2">
      <Button 
        onClick={onCancel} 
        variant={cancelVariant} 
        className="flex-1"
      >
        {cancelText}
      </Button>
      <Button 
        onClick={onConfirm} 
        variant={confirmVariant} 
        className="flex-1"
      >
        {confirmText}
      </Button>
    </div>
  );
}
