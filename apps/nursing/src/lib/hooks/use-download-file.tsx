import { downloadAnalyticsFile } from "@/lib/actions";

export function useDownloadFile() {
  const downloadFile = async (body: {
    id: string;
    count: number;
    name: "data_logs";
  }) => {
    const { url, file } = await downloadAnalyticsFile(body);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  return { downloadFile };
}
