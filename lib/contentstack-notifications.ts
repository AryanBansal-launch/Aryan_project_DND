// Notification functions using Contentstack Management API
import { Notification, ContentstackNotification } from "./types";
import { stack } from "./contentstack";
import { QueryOperation } from "@contentstack/delivery-sdk";
import { 
  getManagementApiUrl, 
  getManagementApiHeaders, 
  getContentstackEnvironment 
} from "./contentstack-config";

// Create a notification entry in Contentstack
export async function createNotificationInContentstack(
  userEmail: string,
  type: 'application' | 'job_update' | 'system',
  title: string,
  message: string,
  metadata?: Record<string, any>
): Promise<string | null> {
  try {
    const entryData = {
      user_email: userEmail,
      type: type,
      title: title,
      message: message,
      read: false,
      metadata: metadata ? JSON.stringify(metadata) : ''
    };

    const postData = JSON.stringify({ entry: entryData });
    const url = getManagementApiUrl('/v3/content_types/notification/entries');

    const response = await fetch(url, {
      method: 'POST',
      headers: getManagementApiHeaders(),
      body: postData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create notification in Contentstack:', response.status, errorText);
      return null;
    }

    const result = await response.json();
    const entryUid = result.entry?.uid;

    if (entryUid) {
      // Publish the entry
      const publishUrl = getManagementApiUrl(`/v3/content_types/notification/entries/${entryUid}/publish`);
      const publishResponse = await fetch(publishUrl, {
        method: 'POST',
        headers: getManagementApiHeaders(),
        body: JSON.stringify({
          entry: {
            environments: [getContentstackEnvironment()],
            locales: ['en-us']
          }
        }),
      });

      if (!publishResponse.ok) {
        console.warn('Notification created but failed to publish:', await publishResponse.text());
      }
    }

    return entryUid || null;
  } catch (error) {
    console.error('Error creating notification in Contentstack:', error);
    return null;
  }
}

// Fetch notifications for a user from Contentstack
export async function getNotificationsFromContentstack(
  userEmail: string,
  limit: number = 50
): Promise<Notification[]> {
  try {
    const result = await stack
      .contentType("notification")
      .entry()
      .query()
      .where("user_email", QueryOperation.EQUALS, userEmail)
      .find();

    if (!result.entries || result.entries.length === 0) {
      return [];
    }

    // Sort by created_at descending and limit
    const sortedEntries = result.entries
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA; // Descending order (newest first)
      })
      .slice(0, limit);

    return sortedEntries.map((entry: any) => {
      const csNotification = entry as ContentstackNotification;
      // Parse metadata if it's a string (stored as JSON string in Contentstack)
      let metadata = {};
      if (csNotification.metadata) {
        if (typeof csNotification.metadata === 'string') {
          try {
            metadata = JSON.parse(csNotification.metadata);
          } catch (e) {
            console.warn('Failed to parse metadata JSON:', e);
            metadata = {};
          }
        } else {
          metadata = csNotification.metadata;
        }
      }
      
      return {
        id: csNotification.uid,
        userId: csNotification.user_id || '',
        userEmail: csNotification.user_email,
        type: csNotification.type,
        title: csNotification.title,
        message: csNotification.message,
        read: csNotification.read || false,
        metadata: metadata,
        createdAt: csNotification.created_at || new Date().toISOString(),
        updatedAt: csNotification.updated_at || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching notifications from Contentstack:', error);
    return [];
  }
}

// Get unread notification count
export async function getUnreadNotificationCountFromContentstack(
  userEmail: string
): Promise<number> {
  try {
    const result = await stack
      .contentType("notification")
      .entry()
      .query()
      .where("user_email", QueryOperation.EQUALS, userEmail)
      .find();

    if (!result.entries || result.entries.length === 0) {
      return 0;
    }

    // Count unread notifications
    const unreadCount = result.entries.filter((entry: any) => {
      return entry.read === false || entry.read === undefined;
    }).length;

    return unreadCount;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
}

// Delete a notification from Contentstack
export async function deleteNotificationFromContentstack(notificationUid: string): Promise<boolean> {
  try {
    const url = getManagementApiUrl(`/v3/content_types/notification/entries/${notificationUid}`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getManagementApiHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to delete notification from Contentstack:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting notification from Contentstack:', error);
    return false;
  }
}

// Mark notification as read in Contentstack
export async function markNotificationAsReadInContentstack(
  notificationUid: string
): Promise<boolean> {
  try {
    // First, fetch the entry to get its current version
    const getUrl = getManagementApiUrl(`/v3/content_types/notification/entries/${notificationUid}`);
    const getResponse = await fetch(getUrl, {
      headers: getManagementApiHeaders(),
    });

    if (!getResponse.ok) {
      console.error('Failed to fetch notification for update');
      return false;
    }

    const entryData = await getResponse.json();
    const entry = entryData.entry;

    // Update the entry
    const updateUrl = getManagementApiUrl(`/v3/content_types/notification/entries/${notificationUid}`);
    const updateData = {
      entry: {
        ...entry,
        read: true,
      },
    };

    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: getManagementApiHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Failed to update notification:', updateResponse.status, errorText);
      return false;
    }

    // Publish the updated entry
    const publishUrl = getManagementApiUrl(`/v3/content_types/notification/entries/${notificationUid}/publish`);
    await fetch(publishUrl, {
      method: 'POST',
      headers: getManagementApiHeaders(),
      body: JSON.stringify({
        entry: {
          environments: [getContentstackEnvironment()],
          locales: ['en-us']
        }
      }),
    });

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

