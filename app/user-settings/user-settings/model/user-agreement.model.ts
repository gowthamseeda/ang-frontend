export class UserAgreement {
  userId: string;
  languageId: string;
  messageKeyId: string;
  userAgreeMessageTime: string;

  constructor(data: Partial<UserAgreement> = {}) {
    this.userId = data.userId || '';
    this.languageId = data.languageId || '';
    this.messageKeyId = data.messageKeyId || '';
    this.userAgreeMessageTime = data.userAgreeMessageTime || '';
  }
}
