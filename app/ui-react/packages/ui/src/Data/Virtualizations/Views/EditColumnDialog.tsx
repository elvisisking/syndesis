import {
  Button,
  ButtonVariant,
  // Form,
  Modal,
  // Stack,
  // StackItem,
  // Text,
  // TextContent,
  // TextList,
  // TextListItem,
  // TextListItemVariants,
  // TextListVariants,
  // TextVariants,
} from '@patternfly/react-core';
import * as React from 'react';

export interface IEditColumnDialogProps {
  i18nCancel: string;
  i18nHeader: string;
  i18nOk: string;
  isOpen: boolean;
  isValid: boolean;
  onCancel(): void;
  onOk(): void;
}

export const EditColumnDialog: React.FunctionComponent<
  IEditColumnDialogProps
> = props => {
  return (
    <Modal
      actions={[
        <Button
          isDisabled={!props.isValid}
          key="ok"
          onClick={props.onOk}
          variant={ButtonVariant.primary}
        >
          {props.i18nOk}
        </Button>,
        <Button
          key="cancel"
          onClick={props.onCancel}
          variant={ButtonVariant.secondary}
        >
          {props.i18nCancel}
        </Button>,
      ]}
      isOpen={props.isOpen}
      isSmall={true}
      onClose={props.onCancel}
      title={props.i18nHeader}
    >
      <div>blah</div>
      {/* <Form isHorizontal={true}>

      </Form> */}
    </Modal>
  );
};
