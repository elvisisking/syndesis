// import {
//   Checkbox,
//   Dropdown,
//   DropdownItem,
//   DropdownToggle,
// } from '@patternfly/react-core';
import {
  editableRowWrapper,
  editableTableBody,
  inlineEditFormatterFactory,
  TableEditConfirmation,
  TableTextInput,
  // EditableTableBody,
} from '@patternfly/react-inline-edit-extension';
import {
  // ExpandableRowContent,
  RowWrapper,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import React from 'react';

export interface IEditableTableColumnState {
  activeEditId: string | null;
  columns: any[];
  rows: any[];
  rowsBackup: any[] | null;
}

export class EditableTableColumn extends React.Component<
  {},
  IEditableTableColumnState
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      activeEditId: null,
      columns: [
        {
          cellFormatters: [this.inlineEditingFormatter],
          title: 'Repositories',
        },
        {
          cellFormatters: [this.inlineEditingFormatter],
          title: 'Branches',
        },
        'Pull requests',
        'Workspaces',
        {
          cellFormatters: [this.inlineEditingFormatter],
          title: 'Last Commit',
        },
      ],
      rows: [
        {
          cells: ['one', 'two', 7, 'four', 'five'],
        },
        {
          cells: ['a', 'two', 0, 'four', 'five'],
        },
        {
          cells: ['p', 'two', 0, 'four', 'five'],
        },
        {
          cells: ['a', 'two', 5, 'four', 'five'],
        },
      ],
      rowsBackup: null,
    };
  }

  // text input
  public inlineEditingFormatter(): any {
    return inlineEditFormatterFactory({
      isEditable: ({ rowIndex }: any) => rowIndex !== 1,
      renderEdit: (
        value: any,
        { columnIndex, rowIndex, column }: any,
        { activeEditId }: any
      ) => {
        const id = this.makeId({ rowIndex, columnIndex, column });
        return (
          <TableTextInput
            id={id}
            defaultValue={value}
            onBlur={(newValue: any) =>
              this.onBlur(newValue, {
                rowIndex,
                columnIndex,
              })
            }
            autoFocus={activeEditId === id}
          />
        );
      },
      renderValue: (value: any, { rowData }: any) =>
        rowData.isTableEditing ? `${value} (Not Editable)` : value,
    });
  }

  public makeId({ column, rowIndex, columnIndex, name }: any): string {
    return `${column.property}-${rowIndex}-${columnIndex}${
      name ? `-${name}` : ''
    }`;
  }

  public onBlur(value: any, { rowIndex, columnIndex }: any): void {
    this.setState(({ rows }) => {
      rows = [...rows];
      const row = rows[rowIndex];
      row.cells[columnIndex] = value;
      return {
        activeEditId: null, // stop autoFocus
        rows,
      };
    });
  }

  public onCollapse(event: any, rowKey: any, isOpen: any): void {
    const { rows } = this.state;
    /**
     * Please do not use rowKey as row index for more complex tables.
     * Rather use some kind of identifier like ID passed with each row.
     */
    rows[rowKey].isOpen = isOpen;
    this.setState({
      rows,
    });
  }

  public onEditCanceled(): void {
    this.setState(({ rows, rowsBackup }: any) => ({
      activeEditId: null,
      rows: rowsBackup,
      rowsBackup: null,
    }));
  }

  public onEditCellClicked(
    event: any,
    clickedRow: any,
    { rowIndex, columnIndex, elementId }: any
  ): void {
    if (elementId !== this.state.activeEditId) {
      this.setState({
        activeEditId: elementId,
      });
    }
  }

  public onEditConfirmed(): void {
    this.setState(({ rows }: any) => ({
      activeEditId: null,
      rows: this.setEditing(rows, false),
      rowsBackup: null,
    }));
  }

  public onRowClick(): void {
    if (!this.state.rowsBackup) {
      this.setState(({ rows }: any) => ({
        rows: this.setEditing(rows, true),
        rowsBackup: JSON.parse(JSON.stringify(rows)), // clone
      }));
    }
  }

  public setEditing(rows: any, isEditing: any): any[] {
    return rows.map((row: any) => {
      row.isEditing = isEditing;
      return row;
    });
  }

  public render() {
    const { columns, rows, activeEditId } = this.state;
    const editConfig = {
      activeEditId,
      editConfirmationType: TableEditConfirmation.TABLE_BOTTOM,
      onEditCanceled: this.onEditCanceled,
      onEditCellClicked: this.onEditCellClicked,
      onEditConfirmed: this.onEditConfirmed,
    };

    const ComposedBody = editableTableBody(TableBody);
    const ComposedRowWrapper = editableRowWrapper(RowWrapper);

    return (
      <Table
        variant={TableVariant.compact}
        caption="Editable Table With Inline Edit Columns"
        cells={columns}
        rows={rows}
        rowWrapper={ComposedRowWrapper}
        onCollapse={this.onCollapse}
      >
        <TableHeader />
        <ComposedBody editConfig={editConfig} onRowClick={this.onRowClick} />
      </Table>
    );
  }
}

// tslint:disable-next-line: one-variable-per-declaration
// export const ComposedBody: React.FunctionComponent<
//   InlineEditBodyProps
// > = props => {
//   return (
//     <div>Blah</div>
//   );
// }
