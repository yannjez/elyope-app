'use client';
import Button from './forms/Button';
import Input from './forms/Input';
import Select from './forms/Select';
import SelectEntity from './forms/SelectEntity';
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
      <div className="flex gap-4 items-center">
        <span>SelectEntity: </span>
        <SelectEntity
          value={null}
          onChange={() => {}}
          loadInitial={async () =>
            [
              { id: '1', name: 'Linked A' },
              { id: '2', name: 'Linked B' },
              { id: '3', name: 'Linked C' },
            ] as any
          }
          search={async (q) =>
            [
              { id: '1', name: `Result for ${q} - 1` },
              { id: '2', name: `Result for ${q} - 2` },
              { id: '3', name: `Result for ${q} - 3` },
              { id: '4', name: `Result for ${q} - 4` },
              { id: '5', name: `Result for ${q} - 5` },
              { id: '6', name: `Result for ${q} - 6` },
            ] as any
          }
          getItemId={(e: any) => e.id}
          getItemLabel={(e: any) => e.name}
          renderItem={(e: any, isSelected) => (
            <div className="flex items-center gap-2">
              <span className="font-medium">{e.name}</span>
              {isSelected && (
                <span className="text-10 text-el-grey-500">(selected)</span>
              )}
            </div>
          )}
          renderValue={(e: any) => e.name}
        />
      </div>
    </div>
  );
}

export default AppTest2SharedComponents;
