(function () {
  const AIR = 0;
  const SOIL = 1;
  const ROCK = 2;
  const WATER = 3;
  const SEED = 4;
  const PLANT = 5;

  const TILES = [
    { id: AIR, name: "air", key: "." },
    { id: SOIL, name: "soil", key: "=" },
    { id: ROCK, name: "rock", key: "#" },
    { id: WATER, name: "water", key: "~" },
    { id: SEED, name: "seed", key: "o" },
    { id: PLANT, name: "plant", key: "Y" },
  ];

  const KEY_TO_ID = Object.fromEntries(TILES.map((t) => [t.key, t.id]));
  const ID_TO_KEY = Object.fromEntries(TILES.map((t) => [t.id, t.key]));

  const DEMOS = [
    {
      label: "I",
      input: ["..o..", ".....", ".....", "=====", "#####"],
      // seed falls onto soil
    },
    {
      label: "II",
      input: ["~....", ".....", "=....", "=====", "#####"],
      // water pours into the pit, then falls
    },
    {
      label: "III",
      input: [".....", ".....", ".o~#.", ".==#.", "#####"],
      // seed on soil beside trapped water becomes a plant
    },
    {
      label: "IV",
      input: ["o.~..", ".....", "..=..", "=====", "#####"],
      // fall, pour, then grow
    },
  ];

  const OPENING = {
    input: [
      "o.~....o",
      "........",
      "..#.....",
      "==.==.=.",
      "========",
      "########",
    ],
  };

  function parse(rows) {
    return rows.map((row) => row.split("").map((ch) => KEY_TO_ID[ch]));
  }

  function clone(grid) {
    return grid.map((row) => row.slice());
  }

  function equal(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      return false;
    }
    for (let r = 0; r < a.length; r += 1) {
      for (let c = 0; c < a[0].length; c += 1) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }
    return true;
  }

  function movable(id) {
    return id === WATER || id === SEED;
  }

  function applyGravity(grid) {
    const h = grid.length;
    const w = grid[0].length;
    let moved = false;
    for (let r = h - 2; r >= 0; r -= 1) {
      for (let c = 0; c < w; c += 1) {
        if (movable(grid[r][c]) && grid[r + 1][c] === AIR) {
          grid[r + 1][c] = grid[r][c];
          grid[r][c] = AIR;
          moved = true;
        }
      }
    }
    return moved;
  }

  function applyPour(grid) {
    const h = grid.length;
    const w = grid[0].length;
    const src = clone(grid);
    let moved = false;

    function canPit(r, c) {
      return c >= 0 && c < w && src[r][c] === AIR && r + 1 < h && src[r + 1][c] === AIR && grid[r][c] === AIR;
    }

    for (let r = 0; r < h; r += 1) {
      for (let c = 0; c < w; c += 1) {
        if (src[r][c] !== WATER) {
          continue;
        }
        if (r + 1 < h && src[r + 1][c] === AIR) {
          continue;
        }
        if (canPit(r, c - 1)) {
          grid[r][c] = AIR;
          grid[r][c - 1] = WATER;
          moved = true;
        } else if (canPit(r, c + 1)) {
          grid[r][c] = AIR;
          grid[r][c + 1] = WATER;
          moved = true;
        }
      }
    }
    return moved;
  }

  function applyGrow(grid) {
    const h = grid.length;
    const w = grid[0].length;
    const next = clone(grid);
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (let r = 0; r < h; r += 1) {
      for (let c = 0; c < w; c += 1) {
        if (grid[r][c] !== SEED) {
          continue;
        }
        if (r + 1 >= h || grid[r + 1][c] !== SOIL) {
          continue;
        }
        const wet = dirs.some(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          return nr >= 0 && nr < h && nc >= 0 && nc < w && grid[nr][nc] === WATER;
        });
        if (wet) {
          next[r][c] = PLANT;
        }
      }
    }
    return next;
  }

  function step(input) {
    const grid = clone(input);
    for (let i = 0; i < 64; i += 1) {
      const fell = applyGravity(grid);
      const poured = applyPour(grid);
      if (!fell && !poured) {
        break;
      }
    }
    return applyGrow(grid);
  }

  function changedCount(a, b) {
    let n = 0;
    for (let r = 0; r < a.length; r += 1) {
      for (let c = 0; c < a[0].length; c += 1) {
        if (a[r][c] !== b[r][c]) {
          n += 1;
        }
      }
    }
    return n;
  }

  function grewCount(input, output) {
    let n = 0;
    for (let r = 0; r < input.length; r += 1) {
      for (let c = 0; c < input[0].length; c += 1) {
        if (output[r][c] === PLANT && input[r][c] !== PLANT) {
          n += 1;
        }
      }
    }
    return n;
  }

  function randomInt(n) {
    return Math.floor(Math.random() * n);
  }

  function generate(h, w) {
    for (let attempt = 0; attempt < 400; attempt += 1) {
      const grid = Array.from({ length: h }, () => Array(w).fill(AIR));
      for (let c = 0; c < w; c += 1) {
        grid[h - 1][c] = ROCK;
        grid[h - 2][c] = randomInt(6) === 0 ? ROCK : SOIL;
      }
      const rockCount = 1 + randomInt(3);
      for (let i = 0; i < rockCount; i += 1) {
        grid[1 + randomInt(h - 3)][randomInt(w)] = ROCK;
      }
      const waters = 2 + randomInt(3);
      const seeds = 2 + randomInt(3);
      for (let i = 0; i < waters; i += 1) {
        const r = randomInt(h - 2);
        const c = randomInt(w);
        if (grid[r][c] === AIR) {
          grid[r][c] = WATER;
        }
      }
      for (let i = 0; i < seeds; i += 1) {
        const r = randomInt(h - 2);
        const c = randomInt(w);
        if (grid[r][c] === AIR) {
          grid[r][c] = SEED;
        }
      }
      const output = step(grid);
      if (equal(grid, output)) {
        continue;
      }
      if (changedCount(grid, output) < 4) {
        continue;
      }
      if (grewCount(grid, output) < 1) {
        continue;
      }
      return { input: grid, output };
    }
    const fallback = parse(OPENING.input);
    return { input: fallback, output: step(fallback) };
  }

  function renderGrid(grid, options) {
    const editable = Boolean(options.editable);
    const onCell = options.onCell;
    const el = document.createElement("div");
    el.className = "wl-grid";
    el.style.gridTemplateColumns = `repeat(${grid[0].length}, var(--wl-cell))`;
    grid.forEach((row, r) => {
      row.forEach((id, c) => {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = `wl-cell is-${TILES[id].name}`;
        cell.setAttribute("aria-label", `${TILES[id].name} at ${r + 1},${c + 1}`);
        cell.disabled = !editable;
        if (editable) {
          cell.addEventListener("click", () => onCell(r, c));
        }
        el.appendChild(cell);
      });
    });
    return el;
  }

  function init() {
    const root = document.getElementById("world-law");
    if (!root) {
      return;
    }

    DEMOS.forEach((demo) => {
      demo.inputGrid = parse(demo.input);
      demo.outputGrid = step(demo.inputGrid);
    });

    let brush = SEED;
    let puzzle = {
      input: parse(OPENING.input),
      output: step(parse(OPENING.input)),
    };
    let guess = clone(puzzle.input);
    let streak = Number(window.localStorage.getItem("world-law-streak") || "0");
    let solved = 0;
    let attempts = 0;

    const observations = root.querySelector("[data-observations]");
    const playInput = root.querySelector("[data-play-input]");
    const playOutput = root.querySelector("[data-play-output]");
    const palette = root.querySelector("[data-palette]");
    const status = root.querySelector("[data-status]");
    const streakEl = root.querySelector("[data-streak]");

    function setStatus(text, kind) {
      status.textContent = text;
      status.dataset.kind = kind || "";
    }

    function updateStreak() {
      streakEl.textContent = String(streak);
    }

    function paintPalette() {
      palette.innerHTML = "";
      TILES.forEach((tile) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `wl-swatch is-${tile.name}${brush === tile.id ? " is-active" : ""}`;
        btn.title = tile.name;
        btn.setAttribute("aria-label", tile.name);
        btn.addEventListener("click", () => {
          brush = tile.id;
          paintPalette();
        });
        const label = document.createElement("span");
        label.textContent = tile.name;
        btn.appendChild(label);
        palette.appendChild(btn);
      });
    }

    function drawObservations() {
      observations.innerHTML = "";
      DEMOS.forEach((demo) => {
        const card = document.createElement("figure");
        card.className = "wl-pair";
        const cap = document.createElement("figcaption");
        cap.textContent = demo.label;
        const row = document.createElement("div");
        row.className = "wl-pair-row";
        const inn = document.createElement("div");
        inn.className = "wl-pane";
        const inLabel = document.createElement("span");
        inLabel.textContent = "t";
        inn.appendChild(inLabel);
        inn.appendChild(renderGrid(demo.inputGrid, { editable: false }));
        const out = document.createElement("div");
        out.className = "wl-pane";
        const outLabel = document.createElement("span");
        outLabel.textContent = "t+1";
        out.appendChild(outLabel);
        out.appendChild(renderGrid(demo.outputGrid, { editable: false }));
        row.appendChild(inn);
        row.appendChild(out);
        card.appendChild(cap);
        card.appendChild(row);
        observations.appendChild(card);
      });
    }

    function drawPlay() {
      playInput.innerHTML = "";
      playOutput.innerHTML = "";
      playInput.appendChild(renderGrid(puzzle.input, { editable: false }));
      playOutput.appendChild(
        renderGrid(guess, {
          editable: true,
          onCell: (r, c) => {
            guess[r][c] = brush;
            drawPlay();
          },
        })
      );
    }

    function loadPuzzle(next) {
      puzzle = next;
      guess = clone(puzzle.input);
      attempts = 0;
      setStatus("Paint the world at t+1.", "");
      drawPlay();
    }

    root.querySelector("[data-copy]").addEventListener("click", () => {
      guess = clone(puzzle.input);
      drawPlay();
      setStatus("Copied the world at t. Edit from there.", "");
    });

    root.querySelector("[data-clear]").addEventListener("click", () => {
      guess = puzzle.input.map((row) => row.map(() => AIR));
      const h = guess.length;
      const w = guess[0].length;
      for (let c = 0; c < w; c += 1) {
        guess[h - 1][c] = ROCK;
      }
      drawPlay();
      setStatus("Cleared, except the bedrock.", "");
    });

    root.querySelector("[data-check]").addEventListener("click", () => {
      if (equal(guess, puzzle.output)) {
        solved += 1;
        streak += 1;
        window.localStorage.setItem("world-law-streak", String(streak));
        updateStreak();
        setStatus("That is the next state. The same law governs every world.", "ok");
        return;
      }
      attempts += 1;
      streak = 0;
      window.localStorage.setItem("world-law-streak", "0");
      updateStreak();
      if (attempts === 3) {
        setStatus("Not yet. Think of a physical process, not a visual pattern.", "bad");
      } else if (attempts === 6) {
        setStatus("Not yet. Three things happen, and they happen in order.", "bad");
      } else {
        setStatus("Not the next state.", "bad");
      }
    });

    root.querySelector("[data-new]").addEventListener("click", () => {
      loadPuzzle(generate(7, 8));
    });

    paintPalette();
    drawObservations();
    updateStreak();
    loadPuzzle({ input: parse(OPENING.input), output: step(parse(OPENING.input)) });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } else if (typeof module !== "undefined") {
    module.exports = { step, parse, ID_TO_KEY, generate };
  }
})();
