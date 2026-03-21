import { Injectable } from '@nestjs/common';

@Injectable()
export class PushNotificationService {
  private readonly NOTIFICATION_ENDPOINT =
    'https://exp.host/--/api/v2/push/send';

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<boolean> {
    const message = {
      to: token,
      sound: 'default',
      title,
      body,
      data: data ?? {},
    };

    const resp = await fetch(this.NOTIFICATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!resp.ok) {
      console.error('Failed to send push notification', await resp.text());
      return false;
    }

    const result = await resp.json();
    console.log({ pushResult: result });
    return true;
  }
}
