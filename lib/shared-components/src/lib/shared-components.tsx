'use client';
import Button from './forms/Button';
import Input from './forms/Input';
import Select from './forms/Select';
import SearchIcon from './icons/search';

export function AppTest2SharedComponents() {
  return (
    <div className="text-achak2 bg-el-grey-100 p-4 rounded-4 flex flex-col gap-4">
      <h1>Welcome to Desing System</h1>
      <div className="flex gap-4 items-center">
        <span>Button : </span>
        <Button className="button-neutral">Neutral</Button>
        <Button className="button-primary">Primary</Button>
        <Button className="button-primary-inverse">Primary Inverse</Button>
        <Button className="button-destructive">Destructive</Button>
      </div>
      <div className="flex gap-4  items-center">
        <span>Input: </span>
        <Input placeholder="Input" />

        <Input placeholder="Input" icon={<SearchIcon />} />
        <Input placeholder="Input" icon={<SearchIcon />} iconPosition="left" />
        <Select options={[]} value="" onChange={() => {}} />
      </div>
    </div>
  );
}

export default AppTest2SharedComponents;
