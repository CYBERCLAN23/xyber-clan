/**
 * Festive Logic Utility
 * Controls whether holiday-themed UI elements are active.
 * Reverts automatically after New Year's Day (Jan 5th).
 */

export const isHolidaySeason = () => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed: 11 is Dec, 0 is Jan
    const currentDate = now.getDate();

    // Active from December 1st to January 5th
    if (currentMonth === 11) return true; // December
    if (currentMonth === 0 && currentDate <= 5) return true; // Early January

    return false;
};

export const getLogo = () => {
    return isHolidaySeason() ? '/team/logo-christmas.jpg' : '/team/logo-new.png';
};

export const HOLIDAY_MESSAGE = "XyberClan wishes you a Merry Christmas and Happy New Year! \"Season's Greetings\"";
