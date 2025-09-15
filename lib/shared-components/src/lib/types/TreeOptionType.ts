// Types for hierarchical tree option component

export type TreeSelectionOption = {
  label: string;
  key: string;
  childrenBehavior?: 'single'; // 'single' = radio buttons for children, parent acts as checkbox
  subChoice?: {
    key: string;
    hasTextField: boolean;
    textFieldPlaceholder?: string;
    label: string;
  }[];
  hasTextField: boolean;
  textFieldPlaceholder?: string;
};

export type TreeSelectionValue = {
  key: string;
  textValue?: string;
  isChecked?: boolean;
};
