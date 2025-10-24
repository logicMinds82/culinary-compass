'use client'

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={() => reset()} variant="destructive">Try again</Button>
      </Card>
    </div>
  )
}