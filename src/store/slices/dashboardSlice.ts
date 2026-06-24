/**
 * Redux Slice para Dashboard
 * Centraliza el estado de todo el dashboard
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  DashboardState,
  Incident,
  Alert,
  DashboardMetrics,
  FilterParams,
} from '@types/dashboard.types';

const initialState: DashboardState = {
  incidents: [],
  alerts: [],
  metrics: null,
  eventsByApplication: {},
  eventsBySeverity: {},
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Incidentes
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.incidents = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addIncident: (state, action: PayloadAction<Incident>) => {
      state.incidents.unshift(action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    updateIncident: (state, action: PayloadAction<Incident>) => {
      const index = state.incidents.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.incidents[index] = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },

    removeIncident: (state, action: PayloadAction<string>) => {
      state.incidents = state.incidents.filter((i) => i.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Alertas
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Métricas
    setMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.metrics = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    // Agregaciones
    setEventsByApplication: (
      state,
      action: PayloadAction<Record<string, number>>
    ) => {
      state.eventsByApplication = action.payload;
    },

    setEventsBySeverity: (
      state,
      action: PayloadAction<Record<string, number>>
    ) => {
      state.eventsBySeverity = action.payload;
    },

    // Estado de carga
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Errores
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset
    reset: (state) => {
      return initialState;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setIncidents,
  addIncident,
  updateIncident,
  removeIncident,
  setAlerts,
  addAlert,
  setMetrics,
  setEventsByApplication,
  setEventsBySeverity,
  setLoading,
  setError,
  reset,
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
