import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { KeyIcon /* PlusIcon */ } from '@patternfly/react-icons';
import {
  cellWidth,
  IAction,
  IExtraData,
  IRowData,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import {
  c_progress_m_success__status_icon_Color,
  global_link_Color,
} from '@patternfly/react-tokens';
import * as React from 'react';
import { toValidHtmlId } from '../../../helpers';

export interface IProjectedColumn {
  expression?: string;
  isPk: boolean;
  name: string;
  position: number;
  properties: { [key: string]: string };
  selected: boolean;
  type: string;
}

export interface IViewOutputTableProps {
  /**
   * The localized accessibility text for the primary key icon in a row.
   */
  a11yPrimaryKeyIcon: string;

  /**
   * The localized text of the row edit button.
   */
  i18nEdit: string;

  /**
   * The localized header text of the expression column.
   */
  i18nExpressionHeader: string;

  /**
   * The localized header text of the name column.
   */
  i18nNameHeader: string;

  /**
   * The localized header text of the position column.
   */
  i18nPositionHeader: string;

  /**
   * The localized header text of the primary key column.
   */
  i18nPrimaryKeyHeader: string;

  /**
   * The localized text of the row kebab properties action.
   */
  i18nProperties: string;

  /**
   * The localized text of the row kebab remove column action.
   */
  i18nRemoveColumn: string;

  /**
   * The localized header text of the type column.
   */
  i18nTypeHeader: string;

  /**
   * The row data.
   */
  projectedColumns: IProjectedColumn[];

  /**
   * The callback for when the row edit button is clicked.
   */
  onEdit: (column: IProjectedColumn) => void;

  /**
   * The callback for when the row kebab properties action is clicked.
   */
  onEditProperties: (column: IProjectedColumn) => void;

  /**
   * The callback for when the row kebab remove column action is clicked.
   */
  onRemove: (column: IProjectedColumn) => void;

  /**
   * The callback for when a projected column is selected or unselected.
   */
  onSelect: (isSelected: boolean, column?: IProjectedColumn) => void;
}

export const ViewOutputTable: React.FunctionComponent<
  IViewOutputTableProps
> = props => {
  // update projected columns when they change
  React.useEffect(() => {
    const updated = props.projectedColumns.map((column: IProjectedColumn) => {
      return convertToRow(column);
    });
    setRows(updated);
  }, [props.projectedColumns]);

  // converts a projected column into a row object
  const convertToRow = (column: IProjectedColumn) => {
    return {
      cells: [
        {
          title: (
            <span
              data-testid={`view-output-table-${toValidHtmlId(
                column.name
              )}-position`}
            >
              {column.position}
            </span>
          ),
          transforms: [cellWidth('10%')],
        },
        {
          title: column.isPk ? (
            <KeyIcon
              aria-label={props.a11yPrimaryKeyIcon}
              color={c_progress_m_success__status_icon_Color.value}
              key={'icon'}
              size={'sm'}
            />
          ) : null,
          transforms: [cellWidth('10%')],
        },
        {
          title: (
            <span
              data-testid={`view-output-table-${toValidHtmlId(
                column.name
              )}-name`}
            >
              {column.name}
            </span>
          ),
        },
        {
          title: (
            <span
              data-testid={`view-output-table-${toValidHtmlId(
                column.name
              )}-type`}
            >
              {column.type}
            </span>
          ),
          transforms: [cellWidth('20%')],
        },
        { title: getExpression(column), transforms: [cellWidth('max')] },
        {
          title: (
            <Button
              data-testid={`view-output-table-${toValidHtmlId(
                column.name
              )}-edit-button`}
              isInline={true}
              onClick={() => props.onEdit(column)}
              style={{ color: global_link_Color.value }}
              variant={ButtonVariant.plain}
            >
              {props.i18nEdit}
            </Button>
          ),
        },
      ],
      column,
      isOpen: false,
      selected: column.selected,
    };
  };

  // converts expression into JSX for use in table row
  const getExpression = (column: IProjectedColumn) => {
    if (column.expression) {
      if (column.expression.length <= 50) {
        return (
          <span
            data-testid={`view-output-table-${toValidHtmlId(
              column.name
            )}-expression`}
          >
            {column.expression}
          </span>
        );
      }

      return (
        <Tooltip content={column.expression} position={'bottom'}>
          <span
            data-testid={`view-output-table-${toValidHtmlId(
              column.name
            )}-expression`}
          >
            {column.expression.substring(0, 50) + ' ...'}
          </span>
        </Tooltip>
      );
    }

    return '';
  };

  const initialRows = props.projectedColumns.map((column: IProjectedColumn) => {
    return convertToRow(column);
  });

  const [rows, setRows] = React.useState(initialRows);

  // actions whose callbacks will show properties and remove selected column
  const actions: IAction[] = [
    {
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData,
        extraData: IExtraData
      ) => handleEditProperties(rowIndex),
      title: props.i18nProperties,
    },
    {
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData,
        extraData: IExtraData
      ) => handleRemoveColumn(rowIndex),
      title: props.i18nRemoveColumn,
    },
  ];

  const columnHeaders = [
    props.i18nPositionHeader,
    props.i18nPrimaryKeyHeader,
    props.i18nNameHeader,
    props.i18nTypeHeader,
    props.i18nExpressionHeader,
    '', // edit button column
  ];

  // const handleCollapse = (
  //   event: React.MouseEvent<Element, MouseEvent>,
  //   rowIndex: number,
  //   isOpen: boolean,
  //   rowData: IRowData,
  //   extraData: IExtraData
  // ) => {
  //   const updated = [...rows];
  //   updated[rowIndex].isOpen = isOpen;
  //   setRows(updated);
  // };

  const handleEditProperties = (rowIndex: number) => {
    props.onEditProperties(rows[rowIndex].column);
  };

  const handleRemoveColumn = (rowIndex: number) => {
    props.onRemove(rows[rowIndex].column);
  };

  const handleSelectColumn = (
    event: React.MouseEvent<Element, MouseEvent>,
    isSelected: boolean,
    rowIndex: number
  ) => {
    let updated;
    if (rowIndex === -1) {
      updated = rows.map(oneRow => {
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      updated = [...rows];
      updated[rowIndex].selected = isSelected;
    }
    setRows(updated);

    if (rowIndex === -1) {
      props.onSelect(isSelected);
    } else {
      props.onSelect(isSelected, updated[rowIndex].column);
    }
  };

  return (
    <Table
      actions={actions}
      cells={columnHeaders}
      data-testid={'view-output-table-table'}
      // onCollapse={handleCollapse}
      onSelect={handleSelectColumn}
      rows={rows}
      variant={TableVariant.compact}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};
