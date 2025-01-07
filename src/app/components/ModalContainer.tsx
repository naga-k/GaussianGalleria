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
          <div className="fixed inset-0 bg-slate-800/75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex justify-end px-6 pt-6">
                  <button
                    onClick={onClose}
                    type="button"
                    className="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold bg-teal-800 hover:bg-teal-600 sm:mt-0 sm:w-auto"
                  >
                    X
                  </button>
                </div>
                <div className="m-6 p-6 flex items-center justify-center border-2 rounded">
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
