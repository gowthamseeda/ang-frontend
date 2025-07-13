export interface MenuAction {
  action: string;
  param?: string;
}

export interface MenuItem extends MenuAction {
  label: string;
  fontIcon?: string;
  disabled?: boolean;
  highlight?: boolean;
}
