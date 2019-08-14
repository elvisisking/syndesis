import {
  Button,
  ButtonVariant,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  SearchIcon,
} from '@patternfly/react-icons';
import * as React from 'react';
import { toValidHtmlId } from '../../../helpers';
import './ViewOutputToolbar.css';

export interface IViewOutputToolbarProps {
  a11yFilterColumns: string;
  a11yFilterText: string;
  a11yReorderDown: string;
  a11yReorderUp: string;
  activeFilter?: string;
  enableAddColumn: boolean;
  enableRemoveColumn: boolean;
  enableReorderColumnDown: boolean;
  enableReorderColumnUp: boolean;
  enableSave: boolean;
  i18nActiveFilter: string;
  i18nAddColumn: string;
  i18nCancel: string;
  i18nFilterPlaceholder: string; // TODO: this needs to be an array to match filter values
  i18nFilterResultsMessage?: string;
  i18nFilterValues: string[];
  i18nRemoveColumn: string;
  i18nSave: string;
  onActiveFilterClosed(): void;
  onAddColumn(): void;
  onCancel(): void;
  onFilter(filterBy: string, filter: string): void;
  onRemoveColumn(): void;
  onReorderColumnDown(): void;
  onReorderColumnUp(): void;
  onSave(): void;
}

export const ViewOutputToolbar: React.FunctionComponent<
  IViewOutputToolbarProps
> = props => {
  // indicates if filter by dropdown is open
  const [isFilterOpen, setFilterOpen] = React.useState(false);

  // the filter text
  const [filter, setFilter] = React.useState();

  // the selected filter by
  const [filterBy, setFilterBy] = React.useState(props.i18nFilterValues[0]);

  const doFilter = () => {
    props.onFilter(filterBy, filter);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleFilterByChanged = (
    event: React.SyntheticEvent<HTMLDivElement, Event>
  ) => {
    setFilterBy(event.currentTarget.textContent || props.i18nFilterValues[0]);
    toggleFilterByDropdown();
  };

  const toggleFilterByDropdown = () => {
    setFilterOpen(!isFilterOpen);
  };

  return (
    <Stack>
      <StackItem className={'view-output-toolbar__stackItem'} isFilled={false}>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarItem>
              <Dropdown
                data-testid={'view-output-toolbar-filter-dropdown'}
                onSelect={handleFilterByChanged}
                toggle={
                  <DropdownToggle
                    data-testid={'view-output-toolbar-filter-toggle'}
                    onToggle={toggleFilterByDropdown}
                  >
                    {filterBy}
                  </DropdownToggle>
                }
                isOpen={isFilterOpen}
                dropdownItems={props.i18nFilterValues.map(
                  (filterType: string, index: number) => {
                    return (
                      <DropdownItem
                        component={'button'}
                        data-testid={`view-output-toolbar-${toValidHtmlId(
                          filterType
                        )}-filter`}
                        key={index}
                      >
                        {filterType}
                      </DropdownItem>
                    );
                  }
                )}
              />
            </ToolbarItem>
            <ToolbarItem>
              <InputGroup>
                <TextInput
                  aria-label={props.a11yFilterText}
                  data-testid={'view-output-toolbar-filter-input'}
                  onChange={handleFilterChange}
                  placeholder={props.i18nFilterPlaceholder}
                  type={'search'}
                />
                <Button
                  aria-label={props.a11yFilterColumns}
                  data-testid={'view-output-toolbar-filter-button'}
                  isDisabled={!filter || !filterBy}
                  onClick={doFilter}
                  variant={ButtonVariant.tertiary}
                >
                  <SearchIcon />
                </Button>
              </InputGroup>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>
              <Button
                data-testid={'view-output-toolbar-add-column-button'}
                isDisabled={!props.enableAddColumn}
                onClick={props.onAddColumn}
                variant={ButtonVariant.secondary}
              >
                {props.i18nAddColumn}
              </Button>{' '}
            </ToolbarItem>
            <ToolbarItem>
              <Button
                data-testid={'view-output-toolbar-remove-column-button'}
                isDisabled={!props.enableRemoveColumn}
                onClick={props.onRemoveColumn}
                variant={ButtonVariant.plain}
              >
                {props.i18nRemoveColumn}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>
              <Button
                aria-label={props.a11yReorderUp}
                className={
                  'pf-u-p-sm pf-u-mr-sm view-output-toolbar__reorderButton'
                }
                data-testid={'view-output-toolbar-reorder-up-button'}
                isDisabled={!props.enableReorderColumnUp}
                isInline={true}
                onClick={props.onReorderColumnUp}
              >
                <ArrowUpIcon size="sm" />
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                aria-label={props.a11yReorderDown}
                className={'pf-u-p-sm view-output-toolbar__reorderButton'}
                data-testid={'view-output-toolbar-reorder-down-button'}
                isInline={true}
                isDisabled={!props.enableReorderColumnDown}
                onClick={props.onReorderColumnDown}
              >
                <ArrowDownIcon size="sm" />
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup className={'pf-m-align-right'}>
            <ToolbarItem>
              <Button
                data-testid={'view-output-toolbar-save-button'}
                isDisabled={!props.enableSave}
                onClick={props.onSave}
                variant={ButtonVariant.primary}
              >
                {props.i18nSave}
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                data-testid={'view-output-toolbar-cancel-button'}
                onClick={props.onCancel}
                variant={ButtonVariant.plain}
              >
                {props.i18nCancel}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      </StackItem>
      {props.i18nFilterResultsMessage && props.activeFilter ? (
        <StackItem
          className={'view-output-toolbar__stackItem'}
          isFilled={false}
        >
          <Split gutter="md">
            <SplitItem isFilled={false} style={{ alignSelf: 'center' }}>
              <TextContent>
                <Text className={'view-output-toolbar__filterResultsMessage'}>
                  {props.i18nFilterResultsMessage}
                </Text>
              </TextContent>
            </SplitItem>
            <SplitItem isFilled={false} style={{ alignSelf: 'center' }}>
              <TextContent>
                <Text>{props.i18nActiveFilter}</Text>
              </TextContent>
            </SplitItem>
            <SplitItem isFilled={true}>
              <Chip
                className={'view-output-toolbar__activeFilter'}
                onClick={props.onActiveFilterClosed}
              >
                {props.activeFilter}
              </Chip>
            </SplitItem>
          </Split>
        </StackItem>
      ) : null}
    </Stack>
  );
};
