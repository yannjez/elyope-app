'use client';

import { useState } from 'react';
import SelectMultiButtons from './SelectMultiButtons';
import { Option } from '../types/Base';

const exampleOptions: Option[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' },
];

export default function SelectMultiButtonsExample() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedValuesWithMax, setSelectedValuesWithMax] = useState<string[]>(
    []
  );
  const [selectedValuesWithMin, setSelectedValuesWithMin] = useState<string[]>(
    []
  );

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-semibold">SelectMultiButtons Examples</h2>

      {/* Basic Example */}
      <div>
        <h3 className="text-md font-medium mb-2">Basic Multi-Select</h3>
        <SelectMultiButtons
          options={exampleOptions}
          value={selectedValues}
          onChange={setSelectedValues}
          placeholder="Select multiple options"
        />
        <p className="text-sm text-gray-600 mt-2">
          Selected: {selectedValues.join(', ') || 'None'}
        </p>
      </div>

      {/* With Max Selections */}
      <div>
        <h3 className="text-md font-medium mb-2">
          With Maximum Selections (3)
        </h3>
        <SelectMultiButtons
          options={exampleOptions}
          value={selectedValuesWithMax}
          onChange={setSelectedValuesWithMax}
          placeholder="Select up to 3 options"
          maxSelections={3}
        />
        <p className="text-sm text-gray-600 mt-2">
          Selected: {selectedValuesWithMax.join(', ') || 'None'}
        </p>
      </div>

      {/* With Min Selections */}
      <div>
        <h3 className="text-md font-medium mb-2">
          With Minimum Selections (2)
        </h3>
        <SelectMultiButtons
          options={exampleOptions}
          value={selectedValuesWithMin}
          onChange={setSelectedValuesWithMin}
          placeholder="Select at least 2 options"
          minSelections={2}
        />
        <p className="text-sm text-gray-600 mt-2">
          Selected: {selectedValuesWithMin.join(', ') || 'None'}
        </p>
      </div>

      {/* Disabled Example */}
      <div>
        <h3 className="text-md font-medium mb-2">Disabled State</h3>
        <SelectMultiButtons
          options={exampleOptions}
          value={['option1']}
          onChange={() => {}}
          placeholder="Disabled multi-select"
          disabled={true}
        />
      </div>
    </div>
  );
}
