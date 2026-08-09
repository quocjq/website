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

  npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

  NODE_ENV = "production";

  installPhase = ''
    runHook preInstall
    mkdir -p $out/share/lunatix-website
    cp -r .output $out/share/lunatix-website/
    runHook postInstall
  '';
}
