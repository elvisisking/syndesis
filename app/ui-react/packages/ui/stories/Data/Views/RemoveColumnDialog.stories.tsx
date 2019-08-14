import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { RemoveColumnDialog } from '../../../src';

const stories = storiesOf('Data/Views/RemoveColumnDialog', module);

stories.add('render', () => (
  <RemoveColumnDialog
    columnsToDelete={['firstName', 'lastName', 'address', 'department']}
    i18nCancel={'Cancel'}
    i18nConfirmMessage={'Are you sure you want to remove these output columns?'}
    i18nHeader={'Remove column(s)?'}
    i18nMessage={'The following columns will be removed from the output table:'}
    i18nRemove={'Remove'}
    isOpen={boolean('show dialog', true)}
    onCancel={action('do cancel dialog')}
    onClose={action('do close dialog')}
    onRemove={action('do remove column')}
  />
));
