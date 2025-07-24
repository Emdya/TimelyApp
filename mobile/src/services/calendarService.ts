// src/services/calendarService.ts

import { db } from "../firebase/firebase";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import * as MailComposer from "expo-mail-composer"; // if using Expo (or a backend email API if not)

interface InvitePayload {
  calendarId: string;
  invitedEmail: string;
  invitedBy: string;
}

export async function sendCalendarInvite({ calendarId, invitedEmail, invitedBy }: InvitePayload) {
  try {
    // 1. Check if user exists (you can query your users collection or auth users if you store them)
    const inviteRef = await addDoc(collection(db, "calendarInvites"), {
      calendarId,
      invitedEmail,
      invitedBy,
      status: "pending",
      sentAt: serverTimestamp(),
    });

    console.log("📧 Invite stored:", inviteRef.id);

    // 2. Email sending logic (for real production, consider backend trigger or third-party email service)
    // This is placeholder logic using Expo
    await MailComposer.composeAsync({
      recipients: [invitedEmail],
      subject: "You're invited to join a calendar on Timely",
      body: `Hey there! You've been invited to sync calendars on Timely. Click here to accept: https://timely.app/invite/${inviteRef.id}`,
    });

    return { success: true };
  } catch (error) {
    console.error(" Failed to send invite:", error);
    return { success: false, error };
  }
}
