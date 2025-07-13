class ConfirmDialogText {
  title: string;
  content: string;
  confirmButton: string;
}

class ConfirmDialogOptions {
  hideCancelButton?: boolean;
}

export interface ConfirmDialogData extends ConfirmDialogText, ConfirmDialogOptions {}

export class ConfirmDialog {
  text: ConfirmDialogText;
  options: ConfirmDialogOptions;

  constructor(confirmDialog: ConfirmDialog) {
    if (confirmDialog.text) {
      this.text = {
        title: confirmDialog.text.title ? confirmDialog.text.title : '',
        content: confirmDialog.text.content ? confirmDialog.text.content : '',
        confirmButton: confirmDialog.text.confirmButton ? confirmDialog.text.confirmButton : ''
      };
    }

    if (confirmDialog.options) {
      this.options = {
        hideCancelButton: confirmDialog.options.hideCancelButton
          ? confirmDialog.options.hideCancelButton
          : false
      };
    }
  }
}
