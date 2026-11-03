import { notFound } from 'next/navigation';
import { JSX, Suspense } from 'react';

export default function CatchAllPage() {
  return (
    <Suspense fallback={null}>
      <TriggerNotFound />
    </Suspense>
  );
}

function TriggerNotFound(): JSX.Element {
  notFound();
}
