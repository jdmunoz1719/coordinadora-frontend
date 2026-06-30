import { masterApi } from '@api/master/master.api';
import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';

export function useMasterData() {
  useEffect(() => {
    const state = useDashboardStore.getState();
    if (state.applications?.length) return;

    const { setApplications, setSeverityLevels, setEventTypes, setIncidentStatuses, setAlertStatuses } = state;

    Promise.all([
      masterApi.getApplications(),
      masterApi.getSeverityLevels(),
      masterApi.getEventTypes(),
      masterApi.getIncidentStatuses(),
      masterApi.getAlertStatuses(),
    ]).then(([applications, severityLevels, eventTypes, incidentStatuses, alertStatuses]) => {
      setApplications(applications);
      setSeverityLevels(severityLevels);
      setEventTypes(eventTypes);
      setIncidentStatuses(incidentStatuses);
      setAlertStatuses(alertStatuses);
    });
  }, []);
}
