import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ViewOutputToolbar } from '../../../src';

const stories = storiesOf('Data/Views/ViewOutputToolbar', module);

const props = {
  a11yFilterColumns: 'Filter columns',
  a11yFilterText: 'Enter filter column text',
  a11yReorderDown: 'Reorder column down',
  a11yReorderUp: 'Reorder column up',
  i18nActiveFilter: 'Active Filter: ',
  i18nAddColumn: 'Add column',
  i18nCancel: 'Cancel',
  i18nFilterPlaceholder: 'Enter column name',
  i18nFilterValues: ['Name', 'Type'],
  i18nRemove: 'Remove',
  i18nRemoveColumn: 'Remove column',
  i18nRemoveColumnDialogConfirmMessage:
    'Are you sure you want to remove these output columns?',
  i18nRemoveColumnDialogHeader: 'Remove columns?',
  i18nRemoveColumnDialogMessage:
    'The following columns will be removed from the output table:',
  i18nSave: 'Save',
};

stories.add('render without filter results', () => (
  <ViewOutputToolbar
    {...props}
    enableAddColumn={boolean('enable add column', true)}
    enableRemoveColumn={boolean('enable remove column', false)}
    enableReorderColumnDown={boolean('enable reorder column down', true)}
    enableReorderColumnUp={boolean('enable reorder column up', true)}
    enableSave={boolean('enable save', true)}
    onActiveFilterClosed={action('do close active filter')}
    onAddColumn={action('do add column')}
    onCancel={action('do cancel')}
    onFilter={action('do filter')}
    onRemoveColumn={action('do remove column')}
    onReorderColumnDown={action('do reorder column down')}
    onReorderColumnUp={action('do reorder column up')}
    onSave={action('do save')}
  />
));

stories.add('render with filter results', () => (
  <ViewOutputToolbar
    {...props}
    activeFilter={'Name=type'}
    enableAddColumn={boolean('enable add column', true)}
    enableRemoveColumn={boolean('enable remove column', true)}
    enableReorderColumnDown={boolean('enable reorder column down', true)}
    enableReorderColumnUp={boolean('enable reorder column up', true)}
    enableSave={boolean('enable save', true)}
    i18nFilterResultsMessage={'2 Results'}
    onActiveFilterClosed={action('do close active filter')}
    onAddColumn={action('do add column')}
    onCancel={action('do cancel')}
    onFilter={action('do filter')}
    onRemoveColumn={action('do remove column')}
    onReorderColumnDown={action('do reorder column down')}
    onReorderColumnUp={action('do reorder column up')}
    onSave={action('do save')}
  />
));
