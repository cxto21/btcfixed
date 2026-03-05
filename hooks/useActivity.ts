/**
 * BTCFixed – Session 5: useActivity hook
 *
 * Reads the localStorage activity log and keeps it fresh via polling.
 * Any component can call this to get the live list of past transactions.
 */
import { useState, useEffect } from 'react';
import { getActivity, type ActivityEntry } from '../services/activityStore';

const POLL_INTERVAL = 5_000; // 5 seconds

export function useActivity(): ActivityEntry[] {
  const [activities, setActivities] = useState<ActivityEntry[]>(() => getActivity());

  useEffect(() => {
    // Poll localStorage for updates triggered by other hooks
    const id = setInterval(() => setActivities(getActivity()), POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Re-read immediately when the hook mounts (useful for navigation)
  useEffect(() => {
    setActivities(getActivity());
  }, []);

  return activities;
}
