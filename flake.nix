{
  description = "Svelte web app development shell";

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
            nodejs_22

            # Language tooling (also usable by editors via PATH)
            typescript
            typescript-language-server
            svelte-language-server
            vscode-langservers-extracted # html/css/json/eslint LSPs
            prettier
            eslint
          ];

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "node $(node --version)"
            echo "Dev server:          npm run dev"
          '';
        };

        formatter = pkgs.nixpkgs-fmt;
      });
}
