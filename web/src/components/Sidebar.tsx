import clsx from 'clsx';

export interface SidebarProps {
  mobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}
export const Sidebar = ({
  mobile = false,
  isOpen = false,
  onClose,
}: SidebarProps) => {
  if (mobile) {
    return (
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      >
        <div
          className={clsx(
            'w-64 h-full bg-base-100 p-4 transition-transform duration-300',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          onClick={e => e.stopPropagation()} // Prevent close on click inside sidebar
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Menu</h2>
            <button className="btn btn-sm btn-ghost" onClick={onClose}>
              ✕
            </button>
          </div>
          <Menu />
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <aside className="w-64 min-h-screen bg-base-300 p-4">
      <Menu />
    </aside>
  );
};

const Menu = () => {
  return (
    <ul className="menu w-full p-0">
      <li>
        <a className="rounded-none">Dashboard</a>
      </li>
      <li>
        <a className="rounded-none">Projects</a>
      </li>
      <li>
        <a className="rounded-none">Tasks</a>
      </li>
      <li>
        <a className="rounded-none">Team</a>
      </li>
    </ul>
  );
};
