{
  description = "Electron-based gaming hub";

  outputs =
    { self, nixpkgs }:
    let
      forAllSystems = nixpkgs.lib.genAttrs systems;
      pkgsFor = nixpkgs.legacyPackages;
      systems = [ "x86_64-linux" ];
    in
    {
      packages = forAllSystems (system: {
        default =
          with pkgsFor.${system};
          stdenvNoCC.mkDerivation (finalAttrs: {
            pname = "falkor";
            version = "0.0.92";

            src = fetchurl {
              url = "https://github.com/Team-Falkor/app/releases/download/v${finalAttrs.version}/falkor.deb";
              hash = "sha256-yDpYu2ehrRQuD29jcyTQla2R2IT1zfBDeWDDRnmqc8Y=";
            };

            unpackPhase = ''
              runHook preUnpack
              dpkg -x $src ./
              runHook postUnpack
            '';

            nativeBuildInputs = [
              makeWrapper
              dpkg
            ];

            installPhase = ''
              runHook preInstall

              mkdir -p $out/bin
              mv usr/share $out/share
              sed -i "s|Exec=.*|Exec=$out/bin/falkor|" $out/share/applications/*.desktop
              mv opt/falkor $out/opt
              makeWrapper ${lib.getExe electron} $out/bin/falkor \
                --argv0 "falkor" \
                --add-flags "$out/opt/resources/app.asar" \

              runHook postInstall
            '';
          });
      });
    };
}
