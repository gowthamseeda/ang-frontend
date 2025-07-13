export class ExternalKeyType {
  id: string;
  name: string;
  maxValueLength: number;
  description?: string;
  translations?: { [key: string]: any };

  constructor(
    id: string,
    name: string = '',
    maxValueLength: number = -1,
    description?: string,
    translations?: { [key: string]: any }
  ) {
    this.id = id;
    this.name = name;
    this.maxValueLength = maxValueLength;
    this.description = description || '';
    this.translations = translations || [];
  }
}
