import {
  Button,
  ButtonVariant,
  Modal,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';
import * as React from 'react';

export interface IRemoveColumnDialogProps {
  /**
   * The names of the columns being deleted.
   */
  columnsToDelete: string[];

  /**
   * The localized text of the cancel button.
   */
  i18nCancel: string;

  /**
   * The localized confirmation message.
   */
  i18nConfirmMessage: string;

  /**
   * The localized header message.
   */
  i18nHeader: string;

  /**
   * The localized message.
   */
  i18nMessage: string;

  /**
   * The localized text of the remove button.
   */
  i18nRemove: string;

  /**
   * Indicates if the dialog is visible..
   */
  isOpen: boolean;

  /**
   * Callback for when the cancel button is clicked.
   */
  onCancel(): void;

  /**
   * Callback for when the close button is clicked.
   */
  onClose(): void;

  /**
   * Callback for when the remove button is clicked.
   */
  onRemove(): void;
}

export const RemoveColumnDialog: React.FunctionComponent<
  IRemoveColumnDialogProps
> = props => {
  return (
    <Modal
      actions={[
        <Button
          key="cancel"
          onClick={props.onCancel}
          variant={ButtonVariant.secondary}
        >
          {props.i18nCancel}
        </Button>,
        <Button
          isDisabled={props.columnsToDelete.length === 0}
          key="remove"
          onClick={props.onRemove}
          variant={ButtonVariant.primary}
        >
          {props.i18nRemove}
        </Button>,
      ]}
      isOpen={props.isOpen}
      isSmall={true}
      onClose={props.onClose}
      title={props.i18nHeader}
    >
      {props.columnsToDelete.length !== 0 ? (
        <Stack>
          <StackItem isFilled={false}>
            <TextContent>
              <Text
                className={'view-output-toolbar__removeColumnDialog-message'}
                component={TextVariants.p}
              >
                {props.i18nMessage}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem
            isFilled={true}
            style={{ maxHeight: '200px', overflowY: 'scroll' }}
          >
            <TextContent>
              <TextList
                className={'view-output-toolbar__removeColumnDialog-columnList'}
                component={TextListVariants.dl}
              >
                {props.columnsToDelete.map((column: string, index: number) => {
                  return (
                    <TextListItem
                      component={TextListItemVariants.dt}
                      key={column}
                      style={{
                        gridColumn: index === 0 || index % 2 === 0 ? 1 : 2,
                      }}
                    >
                      {column}
                    </TextListItem>
                  );
                })}
              </TextList>
            </TextContent>
          </StackItem>
          <StackItem isFilled={false}>
            <TextContent>
              <Text component={TextVariants.p}>{props.i18nConfirmMessage}</Text>
            </TextContent>
          </StackItem>
        </Stack>
      ) : (
        <div />
      )}
    </Modal>
  );
};
