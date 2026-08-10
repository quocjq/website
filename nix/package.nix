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
      in !(type == "directory" && (base == "node_modules" || base == ".output" || base == ".nuxt" || base == ".git"));
  };
in
buildNpmPackage {
  pname = "lunatix-website";
  version = "0.1.0";
  inherit src;
  nodejs = nodejs;

  npmDepsHash = "sha256-05u/ocGOvrhMQIG2hbDXEdLALCYYDsX2Xv37euUvh+M=";

  # Nuxt's build fails under a non-TTY (consola/colors), so we run it ourselves.
  dontNpmBuild = true;

  NODE_ENV = "production";
  FORCE_COLOR = "0";
  CI = "true";

  buildPhase = ''
    runHook preBuild
    npm run build
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    mkdir -p $out/share/lunatix-website
    cp -r .output $out/share/lunatix-website/
    runHook postInstall
  '';
}
