// src/utils/dateUtils.ts

/**
 * Devuelve el inicio y fin del día de HOY en la zona horaria local.
 */
export const getTodayRange = () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Pone la hora a las 00:00:00.000

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Pone la hora a las 23:59:59.999

  return { startOfDay, endOfDay };
};