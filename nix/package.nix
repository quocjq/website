{
  lib,
  buildNpmPackage,
  nodejs,
}:

let
  src = lib.cleanSourceWith {
    src = ../.;
    filter = name: type:
      let base = baseNameOf name;
      in !(type == "directory" && (base == "node_modules" || base == "dist" || base == "dist-server" || base == ".git"));
  };
in
buildNpmPackage {
  pname = "lunatix-website";
  version = "0.2.0";
  inherit src;
  nodejs = nodejs;

  npmDepsHash = "sha256-3ZeDMnLr+lpNBNwhqrgpr3vJqqkGB8hnB0l0hepaYO8=";

  # npm ci honors NODE_ENV=production and would skip the devDeps (vite,
  # @vitejs/plugin-vue) the build needs; keep it out of the derivation env and
  # only set it during the actual build.
  dontNpmBuild = true;

  FORCE_COLOR = "0";
  CI = "true";

  buildPhase = ''
    runHook preBuild
    export NODE_ENV=production
    npm run build
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    mkdir -p $out/share/lunatix-website
    cp -r dist $out/share/lunatix-website/
    cp dist-server/index.mjs $out/share/lunatix-website/index.mjs
    runHook postInstall
  '';
}
