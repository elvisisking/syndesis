import { useViewDefinition, useVirtualization, useVirtualizationHelpers} from '@syndesis/api';
import {
  QueryResults,
  RestDataService,
  ViewDefinition,
} from '@syndesis/models';
import {
  Breadcrumb,
  ExpandablePreview,
  IProjectedColumn,
  PageLoader,
  PageSection,
  PreviewButtonSelection,
  RemoveColumnDialog,
  ViewOutputTable,
  ViewOutputToolbar,
} from '@syndesis/ui';
import { useRouteData, WithLoader } from '@syndesis/utils';
import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { UIContext } from '../../../../app';
import { ApiError } from '../../../../shared';
import resolvers from '../../../resolvers';
import { ViewEditorNavBar } from '../../shared';
import { getPreviewSql, getQueryColumns, getQueryRows } from '../../shared/VirtualizationUtils';

/**
 * @param virtualizationId - the ID of the virtualization that the view belongs to
 * @param viewDefinitionId - the id of the view definition being edited
 */
export interface IViewEditorOutputRouteParams {
  virtualizationId: string;
  viewDefinitionId: string;
}

/**
 * @param previewExpanded - expanded state of the preview area
 * @param viewDefinition - the ViewDefinition
 * @param previewExpanded - the state of preview component expansion
 * @param previewButtonSelection - the button selection state in the preview component
 * @param queryResults - the current query results in the preview component
 */
export interface IViewEditorOutputRouteState {
  virtualization: RestDataService;
  previewExpanded: boolean;
  viewDefinition: ViewDefinition;
  previewButtonSelection: PreviewButtonSelection;
  queryResults: QueryResults;
}

export const ViewEditorOutputPage: React.FunctionComponent = () => {
  const { pushNotification } = useContext(UIContext);
  const { t } = useTranslation(['data', 'shared']);
  const { params, state, history } = useRouteData<
    IViewEditorOutputRouteParams,
    IViewEditorOutputRouteState
>();

  const [activeFilter, setActiveFilter] = React.useState();
  const [columnsToDelete, setColumnsToDelete] = React.useState([] as string[]);
  const [enableRemoveColumn, setEnableRemoveColumn] = React.useState(false);
  const [enableReorderDown, setEnableReorderDown] = React.useState(false);
  const [enableReorderUp, setEnableReorderUp] = React.useState(false);
  const [enableSave] = React.useState(false);
  const [filterResultsMessage, setFilterResultsMessage] = React.useState();
  const [isRemoveDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [previewExpanded, setPreviewExpanded] = React.useState(
    state.previewExpanded
  );
  const [previewButtonSelection, setPreviewButtonSelection] = React.useState(state.previewButtonSelection);
  // const [viewDdl, setViewDdl] = React.useState(state.viewDefinition.ddl);
  const [queryResults, setQueryResults] = React.useState(state.queryResults);
  const { queryVirtualization } = useVirtualizationHelpers();
  const { resource: virtualization } = useVirtualization(params.virtualizationId);
  const { resource: viewDefn, loading, error } = useViewDefinition(
    params.viewDefinitionId,
    state.viewDefinition
  );
  const [selectedColumnNames, setSelectedColumnNames] = React.useState(
    [] as string[]
  );

  const columns: IProjectedColumn[] = [
    {
      expression: 'A short expression',
      isPk: true,
      name: 'Basketball',
      position: 0,
      properties: { magic: 'johnson', larry: 'bird' },
      selected: false,
      type: 'string',
    },
    {
      isPk: false,
      name: 'Baseball',
      position: 1,
      properties: { mike: 'trout', clayton: 'kershaw' },
      selected: false,
      type: 'boolean',
    },
    {
      expression:
        'This is a VERY long expression and therefore would take up a lot of space in the table. Have a nice day!',
      isPk: false,
      name: 'Golf',
      position: 2,
      properties: { rickie: 'fowler', phil: 'mickelson' },
      selected: false,
      type: 'string',
    },
  ];
  const [projectedColumns, setProjectedColumns] = React.useState(columns);
  const [filteredColumns, setFilteredColumns] = React.useState(columns);

  const nameFilter = t('shared:Name');
  const typeFilter = t('shared:Type');

  const doRemoveColumns = () => {
    // TODO: implement remove columns
  };

  const handleActiveFilterClosed = () => {
    setActiveFilter(null);
    setFilterResultsMessage(null);
    setFilteredColumns(projectedColumns);
  };

  const handleAddColumn = () => {
    // TODO: implement add column
  };

  const handleApplyFilter = (filterBy: string, filter: string) => {
    const filtered =
      nameFilter === filterBy
        ? projectedColumns.filter(column => column.name.includes(filter))
        : projectedColumns.filter(column => column.type.includes(filter));
    setFilteredColumns(filtered);
    setFilterResultsMessage(
      t('virtualization.viewEditor.filterResultsMessage', {
        hidden: projectedColumns.length - filtered.length,
        matched: filtered.length,
      })
    );
    setActiveFilter(
      t('virtualization.viewEditor.activeFilterValue', { filterBy, filter })
    );
  };

  const handleCancel = () => {
    // TODO: implement cancel
  };

  const handleEditColumn = () => {
    // TODO: implement edit column
  };

  const handleEditColumnProperties = () => {
    // TODO: implement edit column properties
  };

  const handlePreviewExpandedChanged = (expanded: boolean) => {
    setPreviewExpanded(expanded);
  };

  const handleRemoveColumn = (column: IProjectedColumn) => {
    setColumnsToDelete([column.name]);
    toggleRemoveDialogOpen();
    // TODO: implement remove column
  };

  const handleRemoveSelectedColumns = () => {
    setColumnsToDelete(selectedColumnNames);
    toggleRemoveDialogOpen();
    // TODO: implement remove column
    // notification: The column(s) have been successfully removed
  };

  const handleReorderDown = () => {
    // TODO: implement reorder down
  };

  const handleReorderUp = () => {
    // TODO: implement reorder up
  };

  const handleSave = () => {
    // TODO: implement save
  };

  const handlePreviewButtonSelectionChanged = (
    selection: PreviewButtonSelection
  ) => {
    setPreviewButtonSelection(selection);
  };
  
  const handleEditFinished = () => {
    history.push(
      resolvers.data.virtualizations.views.root({
        virtualization: state.virtualization,
      })
    );
  }
  
  const handleRefreshResults = async () => {
    try {
      let sqlStatement = '';
      if (state.viewDefinition) {
        sqlStatement = getPreviewSql(state.viewDefinition);
      }
      const results: QueryResults = await queryVirtualization(
        params.virtualizationId,
        sqlStatement,
        15,
        0
      );
      pushNotification(
        t('virtualization.queryViewSuccess', {
          name: state.viewDefinition.name,
        }),
        'success'
      );
      setQueryResults(results);
    } catch (error) {
      const details = error.message ? error.message : '';
      pushNotification(
        t('virtualization.queryViewFailed', {
          details,
          name: state.viewDefinition.name,
        }),
        'error'
      );
    }
  };
  
  const handleSelectColumn = (
    isSelected: boolean,
    column?: IProjectedColumn
  ) => {
    if (column && column.selected !== isSelected) {
      let hasSelections = isSelected;
      const updated = projectedColumns;

      for (const projCol of updated) {
        if (projCol.name === column.name) {
          projCol.selected = isSelected;

          // update selected column names
          let columnNames = selectedColumnNames;
          if (isSelected) {
            // add
            columnNames.push(column.name);
          } else {
            // remove
            columnNames = columnNames.filter(name => name !== column.name);
            hasSelections = columnNames.length !== 0;
          }
          setSelectedColumnNames(columnNames);

          break;
        }
      }

      setProjectedColumns(updated);

      // update remove column action enablement if necessary
      if (enableRemoveColumn && !hasSelections) {
        setEnableRemoveColumn(false);
      } else if (!enableRemoveColumn && hasSelections) {
        setEnableRemoveColumn(true);
      }

      // update reorder up enablement if necessary
      if (
        enableReorderUp &&
        (!hasSelections ||
          updated.some(col => col.selected && col.position === 0))
      ) {
        setEnableReorderUp(false);
      } else if (
        !enableReorderUp &&
        hasSelections &&
        !updated.some(col => col.selected && col.position === 0)
      ) {
        setEnableReorderUp(true);
      }

      // update reorder down enablement if necessary
      if (
        enableReorderDown &&
        (!hasSelections ||
          updated.some(
            col => col.selected && col.position === updated.length - 1
          ))
      ) {
        setEnableReorderDown(false);
      } else if (
        !enableReorderDown &&
        hasSelections &&
        !updated.some(
          col => col.selected && col.position === updated.length - 1
        )
      ) {
        setEnableReorderDown(true);
      }
    } else {
      // select/deselect all columns
      const updated = projectedColumns;
      const selected: string[] = [];

      updated.forEach((col: IProjectedColumn) => {
        if (col.selected !== isSelected) {
          col.selected = isSelected;

          if (isSelected) {
            selected.push(col.name);
          }
        }
      });

      setSelectedColumnNames(selected);
      setProjectedColumns(updated);

      // update remove column action enablement if necessary
      if (enableRemoveColumn !== isSelected) {
        setEnableRemoveColumn(isSelected);
      }

      // update reorder up enablement if necessary
      if (enableReorderUp) {
        setEnableReorderUp(false);
      }

      // update reorder down enablement if necessary
      if (enableReorderDown) {
        setEnableReorderDown(false);
      }
    }
  };

  const toggleRemoveDialogOpen = () => {
    setRemoveDialogOpen(!isRemoveDialogOpen);
  };

  return (
    <WithLoader
      loading={loading}
      loaderChildren={<PageLoader />}
      error={error !== false}
      errorChildren={<ApiError error={error as Error} />}
    >
      {() => (
        <>
          <Breadcrumb>
            <Link to={resolvers.dashboard.root()}>{t('shared:Home')}</Link>
            <Link to={resolvers.data.root()}>
              {t('shared:DataVirtualizations')}
            </Link>
            <Link
              to={resolvers.data.virtualizations.views.root({
                virtualization,
              })}
            >
              {params.virtualizationId}
            </Link>
            <span>{viewDefn.name}</span>
          </Breadcrumb>
          <PageSection variant={'light'} noPadding={true}>
            <ViewEditorNavBar
              virtualization={virtualization}
              viewDefinitionId={params.viewDefinitionId}
              viewDefinition={viewDefn}
              previewExpanded={previewExpanded}
              previewButtonSelection={previewButtonSelection} 
              queryResults={queryResults}
              onEditFinished={handleEditFinished}            />
          </PageSection>
          <PageSection variant={'light'} noPadding={true}>
            <ViewOutputToolbar
              a11yFilterColumns={t(
                'virtualization.viewEditor.applyColumnFilter'
              )}
              a11yFilterText={t(
                'virtualization.viewEditor.columnFilterSearchString'
              )}
              a11yReorderDown={t('virtualization.viewEditor.reorderColumnDown')}
              a11yReorderUp={t('virtualization.viewEditor.reorderColumnUp')}
              activeFilter={activeFilter}
              enableAddColumn={true}
              enableRemoveColumn={enableRemoveColumn}
              enableReorderColumnDown={enableReorderDown}
              enableReorderColumnUp={enableReorderUp}
              enableSave={enableSave}
              i18nActiveFilter={t('virtualization.viewEditor.ActiveFilter')}
              i18nAddColumn={t('virtualization.viewEditor.AddColumn')}
              i18nCancel={t('shared:Cancel')}
              i18nFilterPlaceholder={t('shared:filterByNamePlaceholder')}
              i18nFilterResultsMessage={filterResultsMessage}
              i18nFilterValues={[nameFilter, typeFilter]}
              i18nRemoveColumn={t('virtualization.viewEditor.RemoveColumn')}
              i18nSave={t('shared:Save')}
              onActiveFilterClosed={handleActiveFilterClosed}
              onAddColumn={handleAddColumn}
              onCancel={handleCancel}
              onFilter={handleApplyFilter}
              onRemoveColumn={handleRemoveSelectedColumns}
              onReorderColumnDown={handleReorderDown}
              onReorderColumnUp={handleReorderUp}
              onSave={handleSave}
            />
          </PageSection>
          <PageSection variant={'light'} noPadding={true}>
            <RemoveColumnDialog
              columnsToDelete={columnsToDelete}
              i18nCancel={t('shared:Cancel')}
              i18nConfirmMessage={t(
                'virtualization.viewEditor.removeColumnDialogConfirmMessage'
              )}
              i18nHeader={t(
                'virtualization.viewEditor.removeColumnDialogHeader'
              )}
              i18nMessage={t(
                'virtualization.viewEditor.removeColumnDialogMessage'
              )}
              i18nRemove={t('shared:Remove')}
              isOpen={isRemoveDialogOpen}
              onCancel={toggleRemoveDialogOpen}
              onClose={toggleRemoveDialogOpen}
              onRemove={doRemoveColumns}
            />
            <ViewOutputTable
              a11yPrimaryKeyIcon={t(
                'virtualization.viewEditor.primaryKeyHeader'
              )}
              i18nEdit={t('shared:Edit')}
              i18nExpressionHeader={t('virtualization.viewEditor.Expression')}
              i18nNameHeader={t('shared:Name')}
              i18nPositionHeader={t('virtualization.viewEditor.positionHeader')}
              i18nPrimaryKeyHeader={t(
                'virtualization.viewEditor.primaryKeyHeader'
              )}
              i18nProperties={t('virtualization.viewEditor.Properties')}
              i18nRemoveColumn={t('virtualization.viewEditor.RemoveColumn')}
              i18nTypeHeader={t('shared:Type')}
              projectedColumns={filteredColumns}
              onEdit={handleEditColumn}
              onEditProperties={handleEditColumnProperties}
              onRemove={handleRemoveColumn}
              onSelect={handleSelectColumn}
            />
          </PageSection>
          <PageSection variant={'light'} noPadding={true}>
          <ExpandablePreview
              i18nEmptyResultsTitle={t(
                'data:virtualization.preview.resultsTableEmptyStateTitle'
              )}
              i18nEmptyResultsMsg={t(
                'data:virtualization.preview.resultsTableEmptyStateInfo'
              )}
              i18nHidePreview={t('data:virtualization.preview.hidePreview')}
              i18nShowPreview={t('data:virtualization.preview.showPreview')}
              i18nSelectSqlText={t('data:virtualization.preview.selectSql')}
              i18nSelectPreviewText={t('data:virtualization.preview.selectPreview')}
              initialExpanded={previewExpanded}
              initialPreviewButtonSelection={previewButtonSelection}
              onPreviewExpandedChanged={handlePreviewExpandedChanged}
              onPreviewButtonSelectionChanged={handlePreviewButtonSelectionChanged}
              onRefreshResults={handleRefreshResults}
              viewDdl={state.viewDefinition.ddl}
              queryResultRows={getQueryRows(
                queryResults
              )}
              queryResultCols={getQueryColumns(
                queryResults
              )}
            />
          </PageSection>
        </>
      )}
    </WithLoader>
  );
};
