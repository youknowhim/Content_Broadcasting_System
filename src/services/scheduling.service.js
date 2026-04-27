exports.getLiveContent = (rows = []) => {
  if (!Array.isArray(rows) || !rows.length) return [];

  const now = new Date();

  // filter valid content
  const valid = rows.filter(c =>
    c.status === "approved" &&
    c.start_time &&
    c.end_time &&
    new Date(c.start_time) <= now &&
    new Date(c.end_time) >= now
  );

  if (!valid.length) return [];

  // group by subject
  const subjects = {};
  valid.forEach(c => {
    if (!subjects[c.subject]) subjects[c.subject] = [];
    subjects[c.subject].push(c);
  });

  const result = [];

  for (let subject in subjects) {
    const list = subjects[subject]
      .sort((a, b) => a.rotation_order - b.rotation_order);

    const baseTime = new Date(list[0].start_time).getTime();

    const totalCycle =
      list.reduce((sum, c) => sum + c.duration, 0) * 60 * 1000;

    // elapsed since start_time
    const elapsed = (Date.now() - baseTime) % totalCycle;

    let cumulative = 0;

    for (let item of list) {
      cumulative += item.duration * 60 * 1000;

      if (elapsed < cumulative) {
        result.push(item);
        break;
      }
    }
  }

  return result;
};