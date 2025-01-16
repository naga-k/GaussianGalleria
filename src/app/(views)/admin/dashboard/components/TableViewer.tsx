type TableItem = { [index: string]: string | number };

interface TableViewerProps<T extends TableItem> {
  headers: string[];
  values: T[];
}

export default function TableViewer<T extends TableItem>({
  headers,
  values,
}: TableViewerProps<T extends TableItem ? TableItem : unknown>) {
  return (
    <div className="px-8">
      <table className="w-full mt-4">
        <thead>
          <tr className="border-b">
            {headers.map((header, index) => {
              return (
                <th key={index} className="p-2 text-start">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => (
            <tr key={index} className="border-b">
              {Object.keys(value).map((key) => {
                return (
                  <td key={key} className="p-2">
                    {value[key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
