import { ReactNode } from "react";

interface ModelContainerProps {
  isOpened: boolean;
  children: ReactNode;
  onClose: () => void;
}

export default function ModalContainer({
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
              <div className="relative transform bg-background overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex justify-end px-4 pt-4">
                  <button
                    onClick={onClose}
                    type="button"
                    className="default-button"
                  >
                    X
                  </button>
                </div>
                <div className="mx-4 mb-4 my-4 p-6 flex items-center justify-center border-2 rounded">
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
