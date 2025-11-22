import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { 
  getNotificationsFromContentstack, 
  getUnreadNotificationCountFromContentstack,
  markNotificationAsReadInContentstack,
  deleteNotificationFromContentstack
} from "@/lib/contentstack-notifications";

// GET - Fetch notifications for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Get notifications from Contentstack
    let notifications = await getNotificationsFromContentstack(session.user.email, limit);
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    // Get unread count
    const unreadCount = await getUnreadNotificationCountFromContentstack(session.user.email);

    return NextResponse.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      // Mark all notifications as read - fetch all and mark each
      const notifications = await getNotificationsFromContentstack(session.user.email, 100);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      for (const notification of unreadNotifications) {
        await markNotificationAsReadInContentstack(notification.id);
      }
      
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    } else if (notificationId) {
      // Mark single notification as read
      const success = await markNotificationAsReadInContentstack(notificationId);
      if (success) {
        return NextResponse.json({ success: true, message: "Notification marked as read" });
      } else {
        return NextResponse.json(
          { error: "Failed to mark notification as read" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Missing notificationId or markAll flag" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notification
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { error: "Missing notification ID" },
        { status: 400 }
      );
    }

    // Verify the notification belongs to the user
    const notifications = await getNotificationsFromContentstack(session.user.email, 100);
    const notification = notifications.find(n => n.id === notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the notification
    const success = await deleteNotificationFromContentstack(notificationId);
    
    if (success) {
      return NextResponse.json({ success: true, message: "Notification deleted successfully" });
    } else {
      return NextResponse.json(
        { error: "Failed to delete notification" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}

