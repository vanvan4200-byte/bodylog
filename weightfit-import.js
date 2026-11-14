/* BodyLog WeightFit CSV importer
   Loaded after the main BodyLog script. Merges records; never replaces existing data. */
(() => {
  const settings = document.getElementById("settings");
  if (!settings || typeof db === "undefined" || typeof saveDB !== "function") return;

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h3>WeightFitから体重データを取り込む</h3>
    <p class="small">WeightFitのCSVを読み込み、既存の体重記録に追加します。既存データは削除・上書きしません。同じCSVを再度読み込んでも、取り込み済みの記録は重複登録しません。</p>
    <label for="weightFitCsv">WeightFitのCSVファイル</label>
    <input id="weightFitCsv" type="file" accept=".csv,text/csv">
    <div id="weightFitStatus" class="small" aria-live="polite">CSVファイルを選択してください。</div>
    <button id="weightFitImport" style="width:100%;margin-top:10px" disabled>CSVの内容を確認</button>
  `;
  const firstCard = settings.querySelector(".card");
  if (firstCard) firstCard.insertAdjacentElement("afterend", card);
  else settings.appendChild(card);

  const input = card.querySelector("#weightFitCsv");
  const button = card.querySelector("#weightFitImport");
  const status = card.querySelector("#weightFitStatus");
  let parsedRows = null;

  function parseCSV(text) {
    text = text.replace(/^\uFEFF/, "");
    const rows = [];
    let row = [], field = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (ch === '"') quoted = false;
        else field += ch;
      } else {
        if (ch === '"') quoted = true;
        else if (ch === ",") { row.push(field); field = ""; }
        else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (ch !== "\r") field += ch;
      }
    }
    row.push(field);
    if (row.some(v => v !== "")) rows.push(row);
    if (!rows.length) throw new Error("CSVが空です。");

    const headers = rows.shift().map(v => v.trim());
    const dateIndex = headers.indexOf("Date");
    const weightIndex = headers.indexOf("Weight (kg)");
    if (dateIndex < 0 || weightIndex < 0) {
      throw new Error("WeightFit形式のCSVではありません。Date と Weight (kg) の列が必要です。");
    }

    const seen = new Set();
    const result = [];
    let invalid = 0;
    for (const r of rows) {
      const timestamp = (r[dateIndex] || "").trim();
      const weightText = (r[weightIndex] || "").trim();
      const weight = Number(weightText);
      if (!timestamp || !Number.isFinite(Date.parse(timestamp)) ||
          !weightText || !Number.isFinite(weight) || weight <= 0) {
        invalid++;
        continue;
      }
      if (seen.has(timestamp)) continue;
      seen.add(timestamp);
      result.push({
        timestamp,
        date: timestamp.slice(0, 10),
        w: weight,
        fat: null,
        muscle: null,
        waist: null,
        measuredAt: timestamp,
        source: "WeightFit",
        weightFitKey: timestamp
      });
    }
    if (!result.length) throw new Error("有効な体重データが見つかりませんでした。");
    return { result, invalid };
  }

  input.addEventListener("change", async () => {
    parsedRows = null;
    button.disabled = true;
    if (!input.files || !input.files[0]) {
      status.textContent = "CSVファイルを選択してください。";
      return;
    }
    try {
      const text = await input.files[0].text();
      const parsed = parseCSV(text);
      parsedRows = parsed.result;
      status.textContent =
        `${parsed.result.length}件を読み取れました。` +
        (parsed.invalid ? ` 読み取れない行：${parsed.invalid}件。` : "") +
        "「CSVの内容を確認」を押してください。";
      button.disabled = false;
    } catch (e) {
      status.textContent = e.message || "CSVを読み込めませんでした。";
    }
  });

  button.addEventListener("click", () => {
    if (!parsedRows) return;
    const existingKeys = new Set(
      (db.measurements || []).map(x => x.weightFitKey).filter(Boolean)
    );
    const newRows = parsedRows.filter(x => !existingKeys.has(x.weightFitKey));
    const skipped = parsedRows.length - newRows.length;
    if (!newRows.length) {
      status.textContent = `新しく追加する記録はありません（${skipped}件は取り込み済みです）。`;
      return;
    }
    const ok = confirm(
      `WeightFitの体重記録を${newRows.length}件追加します。\n` +
      `すでに取り込み済みのためスキップ：${skipped}件\n\n` +
      `既存の食事・筋トレ・体重記録は削除しません。続けますか？`
    );
    if (!ok) return;
    db.measurements = db.measurements || [];
    db.measurements.push(...newRows);
    saveDB();
    if (typeof renderAll === "function") renderAll();
    status.textContent =
      `${newRows.length}件を追加しました。` +
      (skipped ? ` 重複の${skipped}件はスキップしました。` : "");
    button.disabled = true;
    input.value = "";
    parsedRows = null;
    alert(`${newRows.length}件の体重記録をBodyLogに追加しました。`);
  });

  // Imported entries retain the measurement time; show it in the history list.
  if (typeof renderAll === "function") {
    const originalRenderAll = renderAll;
    renderAll = function () {
      originalRenderAll();
      const ordered = [...(db.measurements || [])]
        .sort((a, b) => b.date.localeCompare(a.date));
      const nodes = document.querySelectorAll("#measurementHistory .item");
      ordered.forEach((entry, i) => {
        if (!entry.measuredAt || !nodes[i]) return;
        const strong = nodes[i].querySelector("b");
        if (!strong) return;
        const time = entry.measuredAt.match(/T(\d{2}:\d{2})/);
        if (time && !strong.textContent.includes(time[1])) {
          strong.textContent += `　${time[1]}`;
        }
      });
    };
    renderAll();
  }
})();
