interface ProgressStepperProps {
  total: number;
  current: number;
}

export default function ProgressStepper({ total, current }: ProgressStepperProps) {
  return (
    <div className="flex gap-2" aria-label="progress">
      {Array.from({ length: total }, (_, idx) => (
        <div
          key={idx}
          data-testid="progress-step"
          aria-current={idx === current ? 'step' : undefined}
          className={`h-2 flex-1 rounded ${idx <= current ? 'bg-blue-600' : 'bg-gray-600'}`}
        />
      ))}
    </div>
  );
}
