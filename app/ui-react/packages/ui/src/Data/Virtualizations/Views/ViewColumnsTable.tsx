import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Stack,
  StackItem,
  TextInput,
} from '@patternfly/react-core';
import { KeyIcon, PlusIcon } from '@patternfly/react-icons';
import {
  IExtraData,
  IRowData,
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table';
import { global_link_Color } from '@patternfly/react-tokens';
import React from 'react';
import { ViewColumnsTableToolbar } from './ViewColumnsTableToolbar';

export interface IViewColumnProps {
  isPk?: boolean;
  name: string;
  type: string;
  expression?: string;
}

export interface IViewColumnsTableProps {
  columns?: IViewColumnProps[];
  columnTypes: string[];
  enableAddColumn: boolean;
  enableRemoveColumn: boolean;
  enableReorderColumnDown: boolean;
  enableReorderColumnUp: boolean;
  i18nAddColumn: string;
  i18nAddExpression: string;
  i18nCancel: string;
  i18nExpressionHeading: string;
  i18nFilterValues: string[];
  i18nNameHeading: string;
  i18nPrimaryKeyHeading: string;
  i18nProperties: string;
  i18nRemoveColumn: string;
  i18nRowNumberHeading: string;
  i18nSave: string;
  i18nTypeHeading: string;
  sourceColumnNames: string[];
  // onEditExpression(index: number): string;
}

export const ViewColumnsTable: React.FunctionComponent<
  IViewColumnsTableProps
> = props => {
  React.useEffect(() => {
    console.log('render');
  });
  const headings = [
    props.i18nRowNumberHeading,
    props.i18nPrimaryKeyHeading,
    props.i18nNameHeading,
    props.i18nTypeHeading,
    props.i18nExpressionHeading,
  ];

  const [openNameIndex, setOpenNameIndex] = React.useState(-1);
  const [openTypeIndex, setOpenTypeIndex] = React.useState(-1);

  const handleSelect = (
    event: React.MouseEvent<Element, MouseEvent>,
    isSelected: boolean,
    rowIndex: number,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    // console.log(`rowIndex=${rowIndex}, isSelected=${isSelected}`);
    // console.log(rowData);
    const updated = [...rows];
    updated[rowIndex].selected = isSelected;
    setRows(updated);
  };

  const handleNameToggle = (index: number) => {
    if (openNameIndex === index) {
      console.log('handleNameToggle-close');
      setOpenNameIndex(-1);
    } else {
      console.log('handleNameToggle-set', index);
      setOpenNameIndex(index);
    }
  };

  const handleTypeToggle = (index: number) => {
    if (openTypeIndex === index) {
      console.log('handleTypeToggle-close');
      setOpenTypeIndex(-1);
    } else {
      console.log('handleTypeToggle-set', index);
      setOpenTypeIndex(index);
    }
  };

  const onNameSelect = (event: Event | undefined, index: number) => {
    console.log(event);
    const updated = [...rows];
    // TODO: update name
    setRows(updated);
    handleNameToggle(index);
  };

  const onTypeSelect = (event: Event | undefined, index: number) => {
    console.log(event);
    const updated = [...rows];
    // TODO: update type
    setRows(updated);
  };

  const isNameDropdownOpen = (index: number): boolean => {
    return openNameIndex === index;
  };

  const isTypeDropdownOpen = (index: number): boolean => {
    // console.log(index, (openTypeIndex === index));
    return openTypeIndex === index;
  };

  const columnData = props.columns
    ? props.columns.map((column: IViewColumnProps, index: number) => ({
        // actions: [
        //   {
        //     title: props.i18nProperties,
        //     onClick: (event, rowId, rowData, extra) =>
        //       console.log('clicked on Some action, on row: ', rowId),
        //   },
        //   {
        //     title: props.i18nRemoveColumn,
        //     onClick: (event, rowId, rowData, extra) =>
        //       console.log('clicked on Another action, on row: ', rowId),
        //   },
        // ],
        cells: [
          { title: index },
          { title: column.isPk ? <KeyIcon key="icon" /> : null },
          {
            title: (
              <Dropdown
                dropdownItems={props.sourceColumnNames.map(
                  (type, nameIndex) => (
                    <DropdownItem key={nameIndex} component="button">
                      {type}
                    </DropdownItem>
                  )
                )}
                isOpen={isNameDropdownOpen(index)}
                onSelect={() => onNameSelect(event, index)}
                toggle={
                  <DropdownToggle
                    splitButtonItems={[
                      <TextInput
                        key={1}
                        id={'column-name-input'}
                        value={column.name}
                        type="text"
                        // onChange={this.handleTextInputChange}
                        // aria-label="text input example"
                      />,
                    ]}
                    onToggle={() => handleNameToggle(index)}
                  />
                }
              />
            ),
          },
          {
            title: (
              <Dropdown
                dropdownItems={props.columnTypes.map((type, typeIndex) => (
                  <DropdownItem key={typeIndex} component="button">
                    {type}
                  </DropdownItem>
                ))}
                isOpen={isTypeDropdownOpen(index)}
                onSelect={() => onTypeSelect(event, index)}
                toggle={
                  <DropdownToggle onToggle={() => handleTypeToggle(index)}>
                    {column.type}
                  </DropdownToggle>
                }
              />
            ),
          },
          {
            title: column.expression ? (
              <a href="#">{column.expression}</a>
            ) : (
              <>
                <PlusIcon key="icon" color={global_link_Color.value} />{' '}
                <a href="#">{props.i18nAddExpression}</a>
              </>
            ),
          },
        ],
        selected: false,
      }))
    : [];
  const [rows, setRows] = React.useState(columnData);

  const handleAddColumn = () => {
    console.log('handleAddColumn');
  };

  const handleRemoveColumn = () => {
    console.log('handleRemoveColumn');
  };

  const handleReorderColumn = () => {
    console.log('handleReorderColumn');
  };

  const handleSave = () => {
    console.log('handleSave');
  };

  const handleCancel = () => {
    console.log('handleCancel');
  };

  return (
    <Stack gutter="lg">
      <StackItem isFilled={false}>
        <ViewColumnsTableToolbar
          enableAddColumn={props.enableAddColumn}
          enableRemoveColumn={props.enableRemoveColumn}
          enableReorderColumnDown={props.enableReorderColumnDown}
          enableReorderColumnUp={props.enableReorderColumnUp}
          i18nAddColumn={props.i18nAddColumn}
          i18nCancel={props.i18nCancel}
          i18nFilterValues={props.i18nFilterValues}
          i18nRemoveColumn={props.i18nRemoveColumn}
          i18nSave={props.i18nSave}
          onAddColumn={handleAddColumn}
          onCancel={handleCancel}
          onRemoveColumn={handleRemoveColumn}
          onReorderColumn={handleReorderColumn}
          onSave={handleSave}
        />
      </StackItem>
      <StackItem isFilled={true}>
        <Table cells={headings} onSelect={handleSelect} rows={rows}>
          <TableHeader />
          <TableBody />
        </Table>
      </StackItem>
    </Stack>
  );
};
