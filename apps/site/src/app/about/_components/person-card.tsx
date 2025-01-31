import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";

export function PersonCard({
  name,
  role,
  description,
  image,
}: { name: string; role: string; description: string; image: JSX.Element }) {
  return (
    <Card className="flex flex-col md:flex-row overflow-hidden">
      <div className="w-40 bg-gray-200">{image}</div>
      <CardContent className="w-full md:w-2/3 p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <p className="text-sm text-gray-500">{role}</p>
        </CardHeader>
        <p className="text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
}
