import Button from './forms/Button';

export function AppTest2SharedComponents() {
  return (
    <div className="text-achak2 bg-goldorak">
      <h1>Welcome to AppTest2SharedComponents!</h1>
      <div className="flex gap-2">
        <Button variant="neutral">Neutral</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  );
}

export default AppTest2SharedComponents;
