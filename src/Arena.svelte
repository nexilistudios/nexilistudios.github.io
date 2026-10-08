<script lang="ts">
  import { onMount } from "svelte";
  let mode = $state<"2D" | "3D">("3D");
  let paused = $state(false);
  let time = $state(0);
  let reducedMotion = $state(false);
  let target = $state({ x: 0, z: 0 });
  const players = [
    { name: "YOU", color: "#c6f36b", x: 0, z: 0 },
    { name: "PLAYER 02", color: "#a89aff", x: 2.8, z: 1.3 },
    { name: "PLAYER 03", color: "#ffa877", x: -2.8, z: -1.8 },
    { name: "PLAYER 04", color: "#75d4e8", x: -1, z: 3 },
  ];
  function position(i: number) {
    const p = players[i];
    return i === 0
      ? target
      : {
          x: p.x + Math.sin(time * 0.65 + i * 2) * 1.4,
          z: p.z + Math.cos(time * 0.45 + i) * 1.3,
        };
  }
  function project(x: number, z: number) {
    return mode === "3D"
      ? { x: 350 + (x - z) * 33, y: 235 + (x + z) * 16 }
      : { x: 350 + x * 34, y: 230 + z * 27 };
  }
  function move(event: MouseEvent) {
    const svg = event.currentTarget as SVGSVGElement;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const dx = point.x - 350,
      dy = point.y - (mode === "3D" ? 235 : 230);
    const x = mode === "3D" ? (dx / 33 + dy / 16) / 2 : dx / 34;
    const z = mode === "3D" ? (dy / 16 - dx / 33) / 2 : dy / 27;
    target = {
      x: Math.max(-4.7, Math.min(4.7, x)),
      z: Math.max(-4.7, Math.min(4.7, z)),
    };
  }
  function keyMove(event: KeyboardEvent) {
    const directions: Record<string, [number, number]> = {
      ArrowUp: [0, -0.5],
      ArrowDown: [0, 0.5],
      ArrowLeft: [-0.5, 0],
      ArrowRight: [0.5, 0],
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    target = {
      x: Math.max(-4.7, Math.min(4.7, target.x + direction[0])),
      z: Math.max(-4.7, Math.min(4.7, target.z + direction[1])),
    };
  }
  onMount(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = media.matches;
    const update = () => (reducedMotion = media.matches);
    media.addEventListener("change", update);
    let frame: number,
      last = 0;
    function tick(now: number) {
      if (last && !paused && !reducedMotion && !document.hidden)
        time += Math.min((now - last) / 1000, 0.05);
      last = now;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", update);
    };
  });
</script>

<div class="arena">
  <div class="arena-top">
    <span
      ><i class="status-dot"></i> THE PLAYGROUND
      <span class="muted">/ 01</span></span
    ><span class="arena-tag">LOCAL SIMULATION</span>
  </div>
  <div class="arena-tools">
    <div class="segmented" aria-label="Arena view">
      {#each ["2D", "3D"] as view}<button
          class:active={mode === view}
          aria-pressed={mode === view}
          onclick={() => (mode = view as "2D" | "3D")}>{view} world</button
        >{/each}
    </div>
    <button
      class="pause"
      onclick={() => (paused = !paused)}
      aria-label={paused ? "Resume animation" : "Pause animation"}
      >{paused ? "▶" : "Ⅱ"}</button
    >
  </div>
  <svg
    class="world"
    viewBox="0 0 700 455"
    role="button"
    tabindex="0"
    aria-label="Player arena. Click to move your player or use arrow keys."
    onclick={move}
    onkeydown={keyMove}
  >
    <defs
      ><radialGradient id="glow"
        ><stop stop-color="#c6f36b" stop-opacity=".09" /><stop
          offset="1"
          stop-color="#c6f36b"
          stop-opacity="0"
        /></radialGradient
      ></defs
    >
    <ellipse cx="350" cy="250" rx="310" ry="200" fill="url(#glow)" />
    {#each Array.from({ length: 11 }, (_, i) => i - 5) as n}
      {@const a = project(n, -5)}{@const b = project(n, 5)}{@const c = project(
        -5,
        n,
      )}{@const d = project(5, n)}
      <path
        d={`M${a.x},${a.y}L${b.x},${b.y}M${c.x},${c.y}L${d.x},${d.y}`}
        stroke={n === -5 || n === 5 ? "#4c5a42" : "#303c2c"}
        fill="none"
        stroke-width="1"
      />
    {/each}
    {#each players.slice(1) as player, j}
      {@const p = position(j + 1)}{@const a = project(
        target.x,
        target.z,
      )}{@const b = project(p.x, p.z)}
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={player.color}
        stroke-opacity=".22"
        stroke-dasharray="3 7"
      />
      <circle
        cx={a.x + (b.x - a.x) * ((time * 0.4 + j * 0.3) % 1)}
        cy={a.y + (b.y - a.y) * ((time * 0.4 + j * 0.3) % 1)}
        r="2.5"
        fill={player.color}
        opacity=".7"
      />
    {/each}
    {#each players as player, i}
      {@const pos = position(i)}{@const p = project(pos.x, pos.z)}
      <g transform={`translate(${p.x} ${p.y})`}>
        <ellipse
          rx="20"
          ry={mode === "3D" ? 9 : 17}
          fill={player.color}
          opacity=".07"
        />
        <ellipse
          rx="13"
          ry={mode === "3D" ? 6 : 12}
          fill="none"
          stroke={player.color}
          stroke-opacity=".5"
        />
        {#if mode === "3D"}
          <path
            d="M-8,-10 Q-8,-23 0,-23 Q8,-23 8,-10 L8,-5 Q0,1 -8,-5Z"
            fill={player.color}
          />
          <circle cy="-31" r="7" fill={player.color} />
          <path d="M3,-22Q8,-18 8,-10L8,-5L3,-3Z" fill="#000" opacity=".17" />
        {:else}<circle r="8" fill={player.color} /><path
            d="M-4,-12L0,-17L4,-12"
            fill={player.color}
          />{/if}
        <text
          y={mode === "3D" ? -49 : -29}
          text-anchor="middle"
          fill={player.color}
          font-size="11"
          letter-spacing="1.2">{player.name}</text
        >
      </g>
    {/each}
    <text
      x="350"
      y="435"
      text-anchor="middle"
      fill="#82907b"
      font-size="12"
      letter-spacing="1.3">CLICK TO MOVE · ARROW KEYS TO EXPLORE</text
    >
  </svg>
  <div class="arena-bottom">
    <span><i class="status-dot"></i> 4 players in the room</span><span
      >X <b>{target.x.toFixed(1)}</b>
      <span class="coordinate">Y <b>0.0</b></span>
      Z <b>{target.z.toFixed(1)}</b></span
    >
  </div>
</div>
