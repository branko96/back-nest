export class CreateNotificationDto {
  userId!: string;
  title!: string;
  description!: string;
  read?: boolean;
}

