"use client";

import { useEffect, useRef, useCallback } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

interface GoogleDrivePickerProps {
  onFilePicked: (file: File) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export default function GoogleDrivePicker({ onFilePicked, onCancel, onError }: GoogleDrivePickerProps) {
  const tokenClientRef = useRef<any>(null);
  const accessTokenRef = useRef<string | null>(null);
  const pickerInitedRef = useRef(false);
  const gisInitedRef = useRef(false);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  const initializePicker = useCallback(async () => {
    try {
      await loadScript("https://apis.google.com/js/api.js");
      await loadScript("https://accounts.google.com/gsi/client");

      await new Promise<void>((resolve) => {
        window.gapi.load("picker", () => {
          pickerInitedRef.current = true;
          resolve();
        });
      });

      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.access_token) {
            accessTokenRef.current = response.access_token;
            createPicker();
          }
        },
      });
      gisInitedRef.current = true;

      // Auto-trigger
      if (accessTokenRef.current) {
        createPicker();
      } else {
        tokenClientRef.current.requestAccessToken({ prompt: "consent" });
      }
    } catch (err) {
      onError?.("Failed to load Google Drive. Please try again.");
    }
  }, []);

  const createPicker = () => {
    if (!accessTokenRef.current) return;

    const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_VIDEOS)
      .setMimeTypes("video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska")
      .setMode(window.google.picker.DocsViewMode.LIST);

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessTokenRef.current)
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .setTitle("Select a video")
      .build();

    picker.setVisible(true);
  };

  const pickerCallback = async (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const doc = data.docs[0];
      await downloadFile(doc.id, doc.name, doc.mimeType);
    } else if (data.action === window.google.picker.Action.CANCEL) {
      onCancel?.();
    }
  };

  const downloadFile = async (fileId: string, fileName: string, mimeType: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const file = new File([blob], fileName, { type: mimeType || "video/mp4" });
      onFilePicked(file);
    } catch (err) {
      onError?.("Failed to download the video. Please try again.");
    }
  };

  useEffect(() => {
    initializePicker();
  }, [initializePicker]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-gray-500">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Connecting to Google Drive...</span>
      </div>
    </div>
  );
}
