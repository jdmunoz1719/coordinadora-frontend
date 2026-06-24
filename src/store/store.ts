/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['dashboard/setIncidents', 'dashboard/setAlerts'],
        ignoredPaths: ['dashboard.incidents', 'dashboard.alerts'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
