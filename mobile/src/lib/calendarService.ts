// Calendar Integration Service
// Handles integration with iOS Calendar (via expo-calendar)
// and Google Calendar (via user's default calendar)

import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly';

export interface CalendarEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  location?: string;
  recurrence?: RecurrenceFrequency;
}

export interface CalendarEventResult {
  success: boolean;
  eventId?: string;
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
   * Convert our recurrence type to expo-calendar RecurrenceRule
   */
  private getRecurrenceRule(recurrence: RecurrenceFrequency): Calendar.RecurrenceRule | undefined {
    if (recurrence === 'none') {
      return undefined;
    }

    const frequencyMap: Record<string, Calendar.Frequency> = {
      daily: Calendar.Frequency.DAILY,
      weekly: Calendar.Frequency.WEEKLY,
      monthly: Calendar.Frequency.MONTHLY,
    };

    return {
      frequency: frequencyMap[recurrence],
      interval: 1,
    };
  }

  /**
   * Add an event to the user's calendar
   */
  async addEvent(eventData: CalendarEventData): Promise<CalendarEventResult> {
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
          return { success: false };
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
        return { success: false };
      }

      // Build event details
      const eventDetails: Omit<Partial<Calendar.Event>, 'id' | 'organizer'> = {
        title: eventData.title,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        notes: eventData.notes,
        location: eventData.location,
        alarms: [{ relativeOffset: -60 }], // 1 hour before
      };

      // Add recurrence rule if specified
      if (eventData.recurrence && eventData.recurrence !== 'none') {
        eventDetails.recurrenceRule = this.getRecurrenceRule(eventData.recurrence);
      }

      // Create the event
      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);

      return { success: !!eventId, eventId };
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      Alert.alert(
        'Erro',
        'Não foi possível adicionar o evento ao calendário. Tente novamente.',
        [{ text: 'OK' }]
      );
      return { success: false };
    }
  }

  /**
   * Delete an event from the user's calendar
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      // Check permissions first
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.warn('No calendar permissions to delete event');
        return false;
      }

      // Delete the event (and all future instances if recurring)
      await Calendar.deleteEventAsync(eventId, { futureEvents: true });
      return true;
    } catch (error) {
      console.error('Error deleting event from calendar:', error);
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
  ): Promise<CalendarEventResult> {
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
   * Add a reminder to the calendar with optional recurrence
   */
  async addReminderToCalendar(
    title: string,
    dateTime: string,
    message?: string,
    petName?: string,
    repeatType: RecurrenceFrequency = 'none'
  ): Promise<CalendarEventResult> {
    const startDate = new Date(dateTime);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes duration

    const fullTitle = petName ? `${title} - ${petName}` : title;
    const fullNotes = message ? `${message}\n\nAdicionado via Caramelo 🐾` : 'Adicionado via Caramelo 🐾';

    return this.addEvent({
      title: fullTitle,
      startDate,
      endDate,
      notes: fullNotes,
      recurrence: repeatType,
    });
  }
}

// Export singleton instance
export const calendarService = new CalendarService();
