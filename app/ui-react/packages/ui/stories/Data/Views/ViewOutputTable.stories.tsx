import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ViewOutputTable } from '../../../src';

const stories = storiesOf('Data/Views/ViewOutputTable', module);

stories.add('render', () => (
  <ViewOutputTable
    a11yPrimaryKeyIcon={'Primary Key'}
    i18nEdit={'Edit'}
    i18nExpressionHeader={'Expression'}
    i18nNameHeader={'Name'}
    i18nPositionHeader={'#'}
    i18nPrimaryKeyHeader={'PK'}
    i18nProperties={'Properties'}
    i18nRemoveColumn={'Remove Column'}
    i18nTypeHeader={'Type'}
    projectedColumns={[
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
        type: 'string',
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
    ]}
    onEdit={action('do edit')}
    onEditProperties={action('do edit properties')}
    onRemove={action('do remove column')}
    onSelect={action('do select column')}
  />
));
