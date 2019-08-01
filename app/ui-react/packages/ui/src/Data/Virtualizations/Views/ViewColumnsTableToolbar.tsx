import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  InputGroup,
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
import { c_badge_BorderRadius } from '@patternfly/react-tokens';
import * as React from 'react';

export interface IViewColumnsTableToolbarProps {
  enableAddColumn: boolean;
  enableRemoveColumn: boolean;
  enableReorderColumnDown: boolean;
  enableReorderColumnUp: boolean;
  i18nAddColumn: string;
  i18nCancel: string;
  i18nFilterValues: string[];
  i18nRemoveColumn: string;
  i18nSave: string;
  onAddColumn(): void;
  onRemoveColumn(): void;
  onReorderColumn(): void;
  onSave(): void;
  onCancel(): void;
}

export const ViewColumnsTableToolbar: React.FunctionComponent<
  IViewColumnsTableToolbarProps
> = props => {
  const [isFilterOpen, setFilterOpen] = React.useState(false);
  const [selectedFilter, setFilter] = React.useState(props.i18nFilterValues[0]);

  const handleSelectFilter = (
    event: React.SyntheticEvent<HTMLDivElement, Event>
  ) => {
    setFilter(event.currentTarget.textContent || props.i18nFilterValues[0]);
    toggleFilterDropdown();
  };

  const toggleFilterDropdown = () => {
    setFilterOpen(!isFilterOpen);
  };

  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarItem>
          <Dropdown
            onSelect={handleSelectFilter}
            toggle={
              <DropdownToggle onToggle={toggleFilterDropdown}>
                {selectedFilter}
              </DropdownToggle>
            }
            isOpen={isFilterOpen}
            dropdownItems={props.i18nFilterValues.map(
              (filter: string, index: number) => {
                return (
                  <DropdownItem key={index} component="button">
                    {filter}
                  </DropdownItem>
                );
              }
            )}
          />
        </ToolbarItem>
        <ToolbarItem>
          <InputGroup>
            <TextInput
              name="textInput11"
              id="textInput11"
              type="search"
              aria-label="search input example"
            />
            <Button
              variant={ButtonVariant.tertiary}
              aria-label="search button for search input"
            >
              <SearchIcon />
            </Button>
          </InputGroup>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <Button variant="secondary" isDisabled={!props.enableAddColumn}>
            {props.i18nAddColumn}
          </Button>{' '}
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="plain" isDisabled={!props.enableRemoveColumn}>
            {props.i18nRemoveColumn}
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarItem key="separator" />
      <ToolbarGroup>
        <ToolbarItem>
          <Button
            isInline={true}
            style={{ borderRadius: c_badge_BorderRadius.value }}
          >
            <ArrowUpIcon size="sm" />
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            isInline={true}
            style={{ borderRadius: c_badge_BorderRadius.value }}
          >
            <ArrowDownIcon size="sm" />
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <Button variant="primary" onClick={props.onSave}>
            {props.i18nSave}
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="plain" onClick={props.onCancel}>
            {props.i18nCancel}
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
    </Toolbar>
  );
};
