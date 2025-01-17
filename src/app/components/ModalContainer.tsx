import { ReactNode } from "react";

interface ModelContainerProps {
  title: string | null;
  isOpened: boolean;
  children: ReactNode;
  onClose: () => void;
}

export default function ModalContainer({
  title,
  isOpened,
  children,
  onClose,
}: ModelContainerProps) {
  return (
    <>
      {isOpened && (
        <div className="relative z-10" role="dialog">
          <div className="fixed inset-0 bg-slate-800/75"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform bg-background overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 w-full max-w-lg">
                <div className="flex items-center justify-between p-4 border-b border-slate-600 shadow">
                  {title && (
                    <h2 className="text-lg font-bold px-2 hover:text-teal-400">{title}</h2>
                  )}
                  <button
                    onClick={onClose}
                    type="button"
                    className="px-2 rounded-full font-bold hover:text-red-500"
                  >
                    X
                  </button>
                </div>
                <div className="m-4 flex items-center justify-center">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
