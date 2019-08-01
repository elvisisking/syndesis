import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { EditableTableColumn } from '../../../src';

const stories = storiesOf(
  'Data/Virtualizations/Views/EditableTableColumn',
  module
);
stories.add('render', () => <EditableTableColumn />);
