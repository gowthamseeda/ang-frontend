export class Video {
  title: string;
  name: string;
  duration?: number;
}

export class Pdf {
  title: string;
  name: string;
  size?: number;
}

export class Contact {
  role: string;
  users: User[];
}

export class User {
  givenName: string;
  familyName?: string;
  email: string;
  phone?: string;
}
