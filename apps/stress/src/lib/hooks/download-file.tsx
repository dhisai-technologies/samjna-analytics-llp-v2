import { downloadSessionAnalyticsFile } from "@/lib/actions";

export function useDownloadFile() {
  const downloadFile = async (body: {
    id: string;
    count: number;
    name: "data_logs" | "speech_logs";
  }) => {
    const { url, file } = await downloadSessionAnalyticsFile(body);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  return { downloadFile };
}
