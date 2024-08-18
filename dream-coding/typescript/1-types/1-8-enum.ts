{
  /**
   * Enum
   */

  const MAX_NUM = 6;
  const MAX_STUDENTS_PER_CLASS = 10;

  const MONDAY = 0;
  const TUESDAY = 1;
  const WEDNESDAY = 2;
  const DAYS_ENUM = Object.freeze({
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
  });

  const dayOfToday = DAYS_ENUM.MONDAY;

  enum DAYS {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
  }

  let day = DAYS.Saturday;

  // day = 10; // Error

  console.log(DAYS.Monday);
}
