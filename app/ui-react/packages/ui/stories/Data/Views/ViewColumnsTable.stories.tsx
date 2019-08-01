import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ViewColumnsTable } from '../../../src';
const stories = storiesOf(
  'Data/Virtualizations/Views/ViewColumnsTable',
  module
);

stories.add('render', () => (
  <ViewColumnsTable
    columns={[
      {
        expression: 'an expression',
        isPk: false,
        name: 'Name',
        type: 'string',
      },
      {
        isPk: false,
        name: 'JobTitle',
        type: 'boolean',
      },
      {
        expression: 'another expression',
        isPk: true,
        name: 'Department',
        type: 'int',
      },
    ]}
    columnTypes={['string', 'int', 'boolean']}
    enableAddColumn={true}
    enableRemoveColumn={true}
    enableReorderColumnDown={true}
    enableReorderColumnUp={true}
    i18nAddColumn={'Add Column'}
    i18nAddExpression={'Add Expression'}
    i18nCancel={'Cancel'}
    i18nExpressionHeading={'Expression'}
    i18nFilterValues={['Name', 'Type']}
    i18nNameHeading={'Name'}
    i18nPrimaryKeyHeading={'PK'}
    i18nProperties={'Properties'}
    i18nRemoveColumn={'Remove Column'}
    i18nRowNumberHeading={'#'}
    i18nSave={'Save'}
    i18nTypeHeading={'Type'}
    sourceColumnNames={['Name', 'JobTitle', 'Department', 'Supervisor']}
  />
));
