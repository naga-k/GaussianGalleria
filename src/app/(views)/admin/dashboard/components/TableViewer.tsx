import { ReactNode } from "react";

type TableItem = { [index: string]: string | number | ReactNode };

interface TableViewerProps<T extends TableItem> {
  headers: string[];
  values: T[];
}

export default function TableViewer<T extends TableItem>({
  headers,
  values,
}: TableViewerProps<T extends TableItem ? TableItem : unknown>) {
  return (
    <div className="my-2 border border-b border-slate-600 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-600">
            {headers.map((header, index) => {
              return (
                <th key={index} className="px-4 py-2 text-start">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => (
            <tr key={index} className="border-b border-slate-600">
              {Object.keys(value).map((key) => {
                return (
                  <td key={key} className="px-4 py-2 text-start">
                    {value[key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full px-4 py-8">{/* TODO: Pagination Support */}</div>
    </div>
  );
}
