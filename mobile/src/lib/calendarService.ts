// Calendar Integration Service
// Handles integration with iOS Calendar (via expo-calendar)
// and Google Calendar (via user's default calendar)

import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

export interface CalendarEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  location?: string;
}

class CalendarService {
  private calendarId: string | null = null;
  private permissionsGranted: boolean = false;

  /**
   * Request calendar permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      this.permissionsGranted = status === 'granted';
      return this.permissionsGranted;
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      return false;
    }
  }

  /**
   * Check if calendar permissions are granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      this.permissionsGranted = status === 'granted';
      return this.permissionsGranted;
    } catch (error) {
      console.error('Error checking calendar permissions:', error);
      return false;
    }
  }

  /**
   * Get the default calendar for the device
   * On iOS, this will be the user's iCloud calendar
   * On Android, this will be the user's Google Calendar
   */
  private async getDefaultCalendar(): Promise<string | null> {
    if (this.calendarId) {
      return this.calendarId;
    }

    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

      // Try to find the default calendar
      let defaultCalendar = calendars.find(
        (cal) => cal.allowsModifications && cal.isPrimary
      );

      // If no primary calendar, find the first modifiable calendar
      if (!defaultCalendar) {
        defaultCalendar = calendars.find((cal) => cal.allowsModifications);
      }

      if (defaultCalendar) {
        this.calendarId = defaultCalendar.id;
        return defaultCalendar.id;
      }

      console.warn('No modifiable calendar found');
      return null;
    } catch (error) {
      console.error('Error getting default calendar:', error);
      return null;
    }
  }

  /**
   * Add an event to the user's calendar
   */
  async addEvent(eventData: CalendarEventData): Promise<boolean> {
    try {
      // Check permissions first
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          Alert.alert(
            'Permissão Necessária',
            'Para adicionar eventos ao calendário, você precisa conceder permissão de acesso ao calendário.',
            [{ text: 'OK' }]
          );
          return false;
        }
      }

      // Get the default calendar
      const calendarId = await this.getDefaultCalendar();
      if (!calendarId) {
        Alert.alert(
          'Erro',
          'Não foi possível encontrar um calendário disponível no seu dispositivo.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Create the event
      const eventId = await Calendar.createEventAsync(calendarId, {
        title: eventData.title,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        notes: eventData.notes,
        location: eventData.location,
        alarms: [{ relativeOffset: -60 }], // 1 hour before
      });

      return !!eventId;
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      Alert.alert(
        'Erro',
        'Não foi possível adicionar o evento ao calendário. Tente novamente.',
        [{ text: 'OK' }]
      );
      return false;
    }
  }

  /**
   * Add a care item to the calendar
   */
  async addCareItemToCalendar(
    title: string,
    dueDate: string,
    notes?: string,
    petName?: string
  ): Promise<boolean> {
    const startDate = new Date(dueDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const fullTitle = petName ? `${title} - ${petName}` : title;
    const fullNotes = notes ? `${notes}\n\nAdicionado via Caramelo 🐾` : 'Adicionado via Caramelo 🐾';

    return this.addEvent({
      title: fullTitle,
      startDate,
      endDate,
      notes: fullNotes,
    });
  }

  /**
   * Add a reminder to the calendar
   */
  async addReminderToCalendar(
    title: string,
    dateTime: string,
    message?: string,
    petName?: string
  ): Promise<boolean> {
    const startDate = new Date(dateTime);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes duration

    const fullTitle = petName ? `${title} - ${petName}` : title;
    const fullNotes = message ? `${message}\n\nAdicionado via Caramelo 🐾` : 'Adicionado via Caramelo 🐾';

    return this.addEvent({
      title: fullTitle,
      startDate,
      endDate,
      notes: fullNotes,
    });
  }
}

// Export singleton instance
export const calendarService = new CalendarService();
