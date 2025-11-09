import { Card, CardContent } from "@/shared/ui/card";
import { UI_TEXT } from "@/shared/constants";

export const PostNotFoundWidget = () => (
  <div className="container mx-auto max-w-4xl p-4">
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-muted-foreground">{UI_TEXT.POST.NOT_FOUND}</p>
      </CardContent>
    </Card>
  </div>
);
