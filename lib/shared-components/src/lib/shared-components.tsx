import Button from './forms/Button';
import Input from './forms/Input';
import SearchIcon from './icons/search';

export function AppTest2SharedComponents() {
  return (
    <div className="text-achak2 bg-goldorak flex flex-col gap-4">
      <h1>Welcome to AppTest2SharedComponents! - UPDATED</h1>
      <div className="flex gap-4">
        <Button className="button-neutral">Neutral</Button>
        <Button className="button-primary">Primary</Button>
        <Button className="button-destructive">Destructive</Button>
      </div>
      <div className="flex gap-4 p-4 bg-body-light ">
        <span>Input</span>
        <Input placeholder="Input" />

        <Input placeholder="Input" icon={<SearchIcon />} />
      </div>
    </div>
  );
}

export default AppTest2SharedComponents;
