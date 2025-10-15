import { useToast } from '../hooks/use-toast';

export const ToastNotifications = () => {
  const { items } = useToast();

  return items.map(({ id, text, severity, style }) => (
    <div className="toast" key={id}>
      <div
        className={`alert ${severity ? ` alert-${severity}` : ''}${style ? ` alert-${style}` : ''}`}
      >
        {text}
      </div>
    </div>
  ));
};
