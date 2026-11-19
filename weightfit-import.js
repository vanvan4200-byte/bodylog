(() => {
  const IMPORT_FLAG_KEY = 'bodylog-imported-weightfit-2026-11-19';

  // 一度取り込み済みなら何もしない
  if (localStorage.getItem(IMPORT_FLAG_KEY) === 'done') return;

  // 本体側の変数・関数が揃っていない場合は何もしない
  if (typeof db === 'undefined' || !Array.isArray(db.measurements)) return;
  if (typeof saveDB !== 'function' || typeof renderAll !== 'function') return;

  const importedMeasurements = [
    { date: '2026-08-16', w: 70.2, fat: null, muscle: null, waist: null },
    { date: '2026-08-17', w: 70.8, fat: null, muscle: null, waist: null },
    { date: '2026-08-18', w: 71.0, fat: null, muscle: null, waist: null },
    { date: '2026-08-19', w: 70.9, fat: null, muscle: null, waist: null },
    { date: '2026-08-20', w: 70.7, fat: null, muscle: null, waist: null },
    { date: '2026-08-21', w: 70.2, fat: null, muscle: null, waist: null },
    { date: '2026-08-22', w: 70.2, fat: null, muscle: null, waist: null },
    { date: '2026-08-23', w: 69.4, fat: null, muscle: null, waist: null },
    { date: '2026-08-24', w: 69.9, fat: null, muscle: null, waist: null },
    { date: '2026-08-25', w: 70.0, fat: null, muscle: null, waist: null },
    { date: '2026-08-26', w: 70.2, fat: null, muscle: null, waist: null },
    { date: '2026-08-27', w: 70.1, fat: null, muscle: null, waist: null },
    { date: '2026-08-28', w: 69.8, fat: null, muscle: null, waist: null },
    { date: '2026-08-29', w: 69.3, fat: null, muscle: null, waist: null },
    { date: '2026-08-30', w: 68.7, fat: null, muscle: null, waist: null },
    { date: '2026-08-31', w: 68.6, fat: null, muscle: null, waist: null },
    { date: '2026-09-01', w: 69.3, fat: null, muscle: null, waist: null },
    { date: '2026-09-02', w: 69.2, fat: null, muscle: null, waist: null },
    { date: '2026-09-03', w: 69.4, fat: null, muscle: null, waist: null },
    { date: '2026-09-04', w: 69.1, fat: null, muscle: null, waist: null },
    { date: '2026-09-05', w: 68.7, fat: null, muscle: null, waist: null },
    { date: '2026-09-06', w: 68.4, fat: null, muscle: null, waist: null },
    { date: '2026-09-07', w: 68.6, fat: null, muscle: null, waist: null },
    { date: '2026-09-08', w: 68.9, fat: null, muscle: null, waist: null },
    { date: '2026-09-09', w: 68.8, fat: null, muscle: null, waist: null },
    { date: '2026-09-10', w: 68.5, fat: null, muscle: null, waist: null },
    { date: '2026-09-11', w: 68.4, fat: null, muscle: null, waist: null },
    { date: '2026-09-12', w: 68.3, fat: null, muscle: null, waist: null },
    { date: '2026-09-13', w: 68.3, fat: null, muscle: null, waist: null },
    { date: '2026-09-14', w: 68.1, fat: null, muscle: null, waist: null },
    { date: '2026-09-15', w: 68.6, fat: null, muscle: null, waist: null },
    { date: '2026-09-16', w: 68.5, fat: null, muscle: null, waist: null },
    { date: '2026-09-17', w: 68.4, fat: null, muscle: null, waist: null },
    { date: '2026-09-18', w: 68.7, fat: null, muscle: null, waist: null },
    { date: '2026-09-19', w: 68.3, fat: null, muscle: null, waist: null },
    { date: '2026-09-20', w: 68.6, fat: null, muscle: null, waist: null },
    { date: '2026-09-21', w: 68.3, fat: null, muscle: null, waist: null },
    { date: '2026-09-22', w: 68.5, fat: null, muscle: null, waist: null },
    { date: '2026-09-23', w: 68.7, fat: null, muscle: null, waist: null },
    { date: '2026-09-24', w: 68.4, fat: null, muscle: null, waist: null },
    { date: '2026-09-25', w: 68.6, fat: null, muscle: null, waist: null },
    { date: '2026-09-26', w: 68.7, fat: null, muscle: null, waist: null },
    { date: '2026-09-27', w: 67.7, fat: null, muscle: null, waist: null },
    { date: '2026-09-28', w: 67.9, fat: null, muscle: null, waist: null },
    { date: '2026-09-29', w: 67.9, fat: null, muscle: null, waist: null },
    { date: '2026-09-30', w: 68.1, fat: null, muscle: null, waist: null },
    { date: '2026-10-01', w: 68.1, fat: null, muscle: null, waist: null },
    { date: '2026-10-02', w: 67.8, fat: null, muscle: null, waist: null },
    { date: '2026-10-03', w: 67.7, fat: null, muscle: null, waist: null },
    { date: '2026-10-04', w: 67.3, fat: null, muscle: null, waist: null },
    { date: '2026-10-05', w: 67.2, fat: null, muscle: null, waist: null },
    { date: '2026-10-06', w: 67.5, fat: null, muscle: null, waist: null },
    { date: '2026-10-07', w: 67.8, fat: null, muscle: null, waist: null },
    { date: '2026-10-08', w: 67.7, fat: null, muscle: null, waist: null },
    { date: '2026-10-09', w: 68.0, fat: null, muscle: null, waist: null },
    { date: '2026-10-10', w: 67.5, fat: null, muscle: null, waist: null },
    { date: '2026-10-11', w: 67.4, fat: null, muscle: null, waist: null },
    { date: '2026-10-12', w: 67.2, fat: null, muscle: null, waist: null },
    { date: '2026-10-13', w: 67.4, fat: null, muscle: null, waist: null },
    { date: '2026-10-14', w: 67.6, fat: null, muscle: null, waist: null },
    { date: '2026-10-15', w: 67.6, fat: null, muscle: null, waist: null },
    { date: '2026-10-16', w: 67.8, fat: null, muscle: null, waist: null },
    { date: '2026-10-17', w: 68.1, fat: null, muscle: null, waist: null },
    { date: '2026-10-18', w: 67.2, fat: null, muscle: null, waist: null },
    { date: '2026-10-19', w: 67.0, fat: null, muscle: null, waist: null },
    { date: '2026-10-20', w: 66.5, fat: null, muscle: null, waist: null },
    { date: '2026-10-21', w: 67.0, fat: null, muscle: null, waist: null },
    { date: '2026-10-22', w: 66.7, fat: null, muscle: null, waist: null },
    { date: '2026-10-23', w: 66.8, fat: null, muscle: null, waist: null },
    { date: '2026-10-24', w: 67.6, fat: null, muscle: null, waist: null },
    { date: '2026-10-25', w: 66.4, fat: null, muscle: null, waist: null },
    { date: '2026-10-26', w: 66.3, fat: null, muscle: null, waist: null },
    { date: '2026-10-27', w: 66.6, fat: null, muscle: null, waist: null },
    { date: '2026-10-28', w: 66.4, fat: null, muscle: null, waist: null },
    { date: '2026-10-29', w: 66.5, fat: null, muscle: null, waist: null },
    { date: '2026-10-30', w: 66.2, fat: null, muscle: null, waist: null },
    { date: '2026-10-31', w: 65.5, fat: null, muscle: null, waist: null },
    { date: '2026-11-01', w: 66.1, fat: null, muscle: null, waist: null },
    { date: '2026-11-02', w: 65.8, fat: null, muscle: null, waist: null },
    { date: '2026-11-03', w: 65.7, fat: null, muscle: null, waist: null },
    { date: '2026-11-04', w: 66.3, fat: null, muscle: null, waist: null },
    { date: '2026-11-05', w: 66.0, fat: null, muscle: null, waist: null },
    { date: '2026-11-06', w: 65.8, fat: null, muscle: null, waist: null },
    { date: '2026-11-07', w: 65.9, fat: null, muscle: null, waist: null },
    { date: '2026-11-08', w: 65.5, fat: null, muscle: null, waist: null },
    { date: '2026-11-09', w: 65.5, fat: null, muscle: null, waist: null },
    { date: '2026-11-10', w: 65.4, fat: null, muscle: null, waist: null },
    { date: '2026-11-11', w: 65.4, fat: null, muscle: null, waist: null },
    { date: '2026-11-12', w: 65.3, fat: null, muscle: null, waist: null },
    { date: '2026-11-13', w: 65.3, fat: null, muscle: null, waist: null },
    { date: '2026-11-14', w: 65.6, fat: null, muscle: null, waist: null },
    { date: '2026-11-15', w: 65.7, fat: null, muscle: null, waist: null },
    { date: '2026-11-16', w: 65.2, fat: null, muscle: null, waist: null },
    { date: '2026-11-17', w: 65.7, fat: null, muscle: null, waist: null },
    { date: '2026-11-18', w: 65.0, fat: null, muscle: null, waist: null },
    { date: '2026-11-19', w: 65.0, fat: null, muscle: null, waist: null }
  ];

  const existingDates = new Set(db.measurements.map(m => m.date));
  let added = 0;

  for (const item of importedMeasurements) {
    if (!item || !item.date || !Number.isFinite(Number(item.w))) continue;
    if (!existingDates.has(item.date)) {
      db.measurements.push({
        id: (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: item.date,
        w: Number(item.w),
        fat: item.fat ?? null,
        muscle: item.muscle ?? null,
        waist: item.waist ?? null
      });
      existingDates.add(item.date);
      added++;
    }
  }

  localStorage.setItem(IMPORT_FLAG_KEY, 'done');

  if (added > 0) {
    saveDB();
    renderAll();
  }
})();
