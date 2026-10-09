<script lang="ts">
  import Arena from "./Arena.svelte";
  let copied = $state(false);
  let copyError = $state(false);
  let tab = $state<"connect" | "movement">("connect");
  const repo = "https://github.com/NexilisLib/nexilis";
  const examples = {
    connect: `using Nexilis.Util;\n\nusing var client = new NexilisClient\n{\n    ServerAddress = "127.0.0.1",\n    Password = "password"\n};\n\nclient.OnReady += () =>\n    Console.WriteLine("Welcome to the room.");\n\nawait client.ConnectAsync();\n\n// Keep the client alive for your game loop.\n// Call client.Update() each frame.`,
    movement: `// After connecting, wire up remote players.\nclient.OnRemoteClientPosition += (id, position) =>\n{\n    // Apply position.X, .Y, .Z to your player.\n};\n\n// In your game loop, process incoming updates.\nclient.Update();\n\n// Send your player's world position.\nclient.SendPosition(x: 1.0f, y: 0.0f, z: 2.5f);\n\n// Or send movement with the frame delta.\nclient.SendMovement(1.0f, 0.0f, 0.0f, 0.016f);`,
  };
  async function copy() {
    try {
      await navigator.clipboard.writeText(examples[tab]);
      copied = true;
      copyError = false;
      setTimeout(() => (copied = false), 2000);
    } catch {
      copyError = true;
    }
  }
</script>

<svelte:head
  ><meta property="og:title" content="Nexilis: Build connected worlds." /><meta
    property="og:description"
    content="Your game. Your engine. One connected world. Explore the Nexilis C# multiplayer API."
  /></svelte:head
>

<header id="top" class="site-header">
  <a class="brand" href="#top" aria-label="Nexilis home"
    ><span class="brand-icon">N</span>nexilis<span class="brand-dot">.</span></a
  >
  <nav aria-label="Main navigation">
    <a href="#features">Why Nexilis</a><a href="#csharp">C# API</a><a
      href="./docs/index.html">Documentation <span>↗</span></a
    >
  </nav>
  <a class="github-link" href={repo}>GitHub <span>↗</span></a>
</header>
<main>
  <section class="hero">
    <div class="hero-copy">
      <a class="release" href={`${repo}/blob/main/VERSION.txt`}
        ><span class="status-dot"></span> 0.0.4-unstable
        <span class="release-divider">/</span>
        OPEN SOURCE <span>↗</span></a
      >
      <h1>Build connected<br />worlds<span class="lime">.</span></h1>
      <p class="hero-description">
        The multiplayer layer for your next idea.<br />A native C++ core. An
        expressive C# API.<br />Your players, in the same world.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="#get-started"
          >Start building <span>↗</span></a
        ><a class="text-link" href="./docs/index.html"
          >Explore the docs <span>→</span></a
        >
      </div>
      <div class="hero-note">
        <span class="tiny-brackets">&#123; &#125;</span> Engine-independent. Open
        by design.
      </div>
    </div>
    <Arena />
  </section>
  <div class="technology-strip">
    <span>LESS PLUMBING. MORE PLAY.</span>
    <div>
      C# <i>/</i> .NET Standard 2.0 <i>/</i> C++20 <i>/</i> TCP + UDP <i>/</i> LGPL-3.0-or-later
    </div>
  </div>
  <section id="features" class="features section">
    <div class="section-heading">
      <div>
        <p class="eyebrow">01 / THE FOUNDATION</p>
        <h2>Your world.<br />Connected from the start.</h2>
      </div>
      <p>
        From the first connection to the next player update,<br
          class="desktop"
        /> Nexilis gives your multiplayer code a common language.
      </p>
    </div>
    <div class="feature-grid">
      <article>
        <span class="feature-icon">&#123; &#125;</span>
        <p class="feature-number">01</p>
        <h3>C# feels right at home.</h3>
        <p>
          Connect, join a room, and respond to player events with a managed API.
          Plain C# data keeps your engine in your hands.
        </p>
        <a href="#csharp">Meet the C# API <span>↗</span></a>
      </article>
      <article>
        <span class="feature-icon">⌘</span>
        <p class="feature-number">02</p>
        <h3>True cross platform experience.</h3>
        <p>
        At least technically any game engine anywhere anytime. Nexilis-C API allows connection to practically any programming language.
        </p>
        <a href="./docs/classNexilis_1_1Util_1_1NexilisClient.html"
          >Explore the client <span>↗</span></a
        >
      </article>
      <article>
        <span class="feature-icon">⇄</span>
        <p class="feature-number">03</p>
        <h3>Movement meets momentum.</h3>
        <p>
          TCP for reliable room management. UDP for position and movement
          updates. Choose a transport for your custom packets, too.
        </p>
        <a href={`${repo}/blob/main/docs/server_message.md`}
          >See the protocol <span>↗</span></a
        >
      </article>
    </div>
  </section>
  <section id="csharp" class="api-section section">
    <div class="api-copy">
      <p class="eyebrow">02 / SMALL API. BIG POSSIBILITIES.</p>
      <h2>Speak C#.<br />Think multiplayer.</h2>
      <p>
        Bring your game loop. Nexilis handles the connection lifecycle and gives
        you callbacks for the players sharing your room.
      </p>
      <ul class="api-list">
        <li><span>↗</span> Async connections and room joins</li>
        <li><span>↗</span> Player lifecycle and position callbacks</li>
        <li><span>↗</span> Engine-independent position data</li>
        <li><span>↗</span> Access to the underlying client API</li>
      </ul>
      <a
        class="text-link"
        href="./docs/classNexilis_1_1Util_1_1NexilisClient.html"
        >Read the C# reference <span>→</span></a
      >
    </div>
    <div class="code-window">
      <div class="code-title">
        <span><i></i><i></i><i></i></span><span>YOUR NEXT MULTIPLAYER GAME</span
        ><span>C#</span>
      </div>
      <div class="code-tabs">
        <button
          class:selected={tab === "connect"}
          onclick={() => {
            tab = "connect";
            copied = false;
          }}
          aria-pressed={tab === "connect"}>01 Connect</button
        ><button
          class:selected={tab === "movement"}
          onclick={() => {
            tab = "movement";
            copied = false;
          }}
          aria-pressed={tab === "movement"}>02 Move players</button
        ><button class="copy-button" onclick={copy}
          >{copied ? "Copied ✓" : "Copy ↗"}</button
        >
      </div>
      <pre><code
          >{#each examples[tab].split("\n") as line, i}<span class="code-line"
              ><span class="line-number">{i + 1}</span><span
                class:comment={line.trim().startsWith("//")}
                class:keyword={line.startsWith("using") ||
                  line.startsWith("await")}>{line || " "}</span
              ></span
            >{/each}</code
        ></pre>
      <div class="code-foot" aria-live="polite">
        {copyError
          ? "Select the example to copy it manually."
          : "A running Nexilis server and native libraries are required."}
      </div>
    </div>
  </section>
  <section id="get-started" class="start-section section">
    <div>
      <p class="eyebrow">03 / FROM IDEA TO FIRST CONNECTION</p>
      <h2>Make room for<br />your next idea<span class="lime">.</span></h2>
      <p>
        Start with the source. Build the native runtime and C# bindings, then
        connect your application.
      </p>
      <a class="button primary" href={`${repo}/tree/main/bindings`}
        >C# setup guide <span>↗</span></a
      >
    </div>
    <div class="steps">
      <article>
        <span>01</span>
        <div>
          <h3>Get the source</h3>
          <code
            >git clone --recurse-submodules https://github.com/NexilisLib/nexilis.git</code
          >
        </div>
      </article>
      <article>
        <span>02</span>
        <div>
          <h3>Build the C# distribution</h3>
          <code>cd nexilis<br />make install-csharp</code>
          <p>
            Builds the native libraries and C# assembly into dist/. Requires a
            .NET SDK, CMake, a C++20 compiler, and OpenSSL development files.
          </p>
        </div>
      </article>
      <article>
        <span>03</span>
        <div>
          <h3>Connect your world</h3>
          <p>
            Start a server from the examples, reference the assembly, and make
            the native libraries available to your application's loader.
          </p>
          <a href={`${repo}/tree/main/examples`}>Browse server examples ↗</a>
        </div>
      </article>
    </div>
  </section>
  <aside class="release-note">
    <span class="status-dot"></span>
    <p>
      <strong>Built in the open. Still evolving.</strong> Nexilis is an unstable prerelease,
      currently tested primarily on Linux. Follow development and review the release
      notes before shipping.
    </p>
    <a href={`${repo}/blob/main/docs/README.md`}>Project status ↗</a>
  </aside>
</main>
<footer>
  <a class="brand" href="#top"
    ><span class="brand-icon">N</span>nexilis<span class="brand-dot">.</span></a
  >
  <p>Good things happen when players connect.</p>
  <div>
    <a href="./docs/index.html">Documentation ↗</a><a href={repo}>Source ↗</a><a
      href={`${repo}/blob/main/LICENSE`}>License ↗</a
    >
  </div>
  <span class="footer-caption">AN OPEN-SOURCE MULTIPLAYER LIBRARY</span>
</footer>
