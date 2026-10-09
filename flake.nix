{
  description = "Svelte / SvelteKit web app development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            # Runtime + package managers
            nodejs_22
            pnpm
            # npm ships with nodejs; yarn/bun are optional:
            # yarn
            # bun

            # Language tooling (also usable by editors via PATH)
            typescript
            typescript-language-server
            svelte-language-server
            vscode-langservers-extracted # html/css/json/eslint LSPs
            prettier
            eslint

            # Browser testing (Playwright uses the Nix-provided browsers)
            playwright-driver.browsers

            # Misc
            git
          ];

          # Make Playwright use Nix's browsers instead of trying to download its own
          PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
          PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "node $(node --version) | pnpm $(pnpm --version)"
            echo "Scaffold a project:  pnpm dlx sv create my-app"
            echo "Dev server:          pnpm dev --host"
          '';
        };

        formatter = pkgs.nixpkgs-fmt;
      });
}
