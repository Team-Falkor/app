import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useLanguageContext } from "@/contexts/I18N";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderOpen, Shuffle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGames } from "../../../hooks/useGames";
import NewGameSetting from "./setting";

const formSchema = z.object({
  gameName: z.string().min(1, { message: "Required" }),
  gamePath: z.string().min(1, { message: "Required" }),
  gameId: z.string().min(1, { message: "Required" }),
  gameIcon: z.string().min(1, { message: "Required" }),
  gameArgs: z.string().optional(),
  gameCommand: z
    .string()
    .optional()
    .refine((s) => !s?.includes(" "), "No Spaces!"),
});

const NewGameForm = () => {
  const { t } = useLanguageContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameName: "",
      gamePath: "",
      gameArgs: "",
      gameIcon: "",
      gameId: "",
    },
  });

  const { addGame, loading, error } = useGames(); // Use the hook

  const handlePathButton = async () => {
    const selected: any = await window.ipcRenderer.invoke(
      "generic:open-dialog",
      {
        properties: ["openFile"],
        filters: [{ name: "Executable", extensions: ["exe", "sh"] }],
      }
    );

    if (selected.canceled) return;
    if (!selected.filePaths.length) return;

    const selectedPath = selected.filePaths[0];

    form.setValue("gamePath", selectedPath.replace(/\\/g, "//"));
  };

  const handleIconButton = async () => {
    const selected: any = await window.ipcRenderer.invoke(
      "generic:open-dialog",
      {
        properties: ["openFile"],
        filters: [
          { name: "Images", extensions: ["jpg", "png", "jpeg", "webp"] },
        ],
      }
    );

    if (selected.canceled) return;
    if (!selected.filePaths.length) return;

    const selectedPath = selected.filePaths[0];
    form.setValue("gameIcon", selectedPath.replace(/\\/g, "//"));
  };

  const handleShuffleButton = () => {
    const currentGameId = form.getValues("gameId");

    if (currentGameId || currentGameId.trim() !== "") return;

    const gameName = form.getValues("gameName");

    if (gameName.length < 1)
      form.setValue("gameId", Math.random().toString(36).substring(2, 15)); // Random string
    else
      form.setValue(
        "gameId",
        gameName.split(" ").join("-").toLowerCase() // Slugified string
      );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { gameName, gamePath, gameId, gameIcon, gameArgs, gameCommand } =
      values;

    try {
      await addGame({
        game_name: gameName,
        game_path: gamePath,
        game_id: gameId,
        game_icon: gameIcon,
        game_args: gameArgs,
        game_command: gameCommand,
      });

      form.reset();
    } catch (err) {
      console.error("Failed to add game:", err);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete={"off"}
      >
        <FormField
          control={form.control}
          name="gameName"
          render={({ field }) => (
            <NewGameSetting
              text={t("name")}
              description={t("the_name_of_the_game")}
              field={field}
              type="search"
              required
            />
          )}
        />

        <FormField
          control={form.control}
          name="gamePath"
          rules={{
            required: {
              value: true,
              message: "Required",
            },
          }}
          render={({ field }) => (
            <NewGameSetting
              text={t("path")}
              description={t("the_path_to_the_game")}
              type="search"
              Button={
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={handlePathButton}
                >
                  <FolderOpen />
                </Button>
              }
              required
              field={field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <NewGameSetting
              text={t("id")}
              description={t("game_id")}
              required
              field={field}
              type="search"
              Button={
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={handleShuffleButton}
                >
                  <Shuffle />
                </Button>
              }
            />
          )}
        />

        <FormField
          control={form.control}
          name="gameIcon"
          render={({ field }) => (
            <NewGameSetting
              text={t("icon")}
              description={t("the_path_or_url_of_the_icon")}
              type="search"
              required
              Button={
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={handleIconButton}
                >
                  <FolderOpen />
                </Button>
              }
              field={field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="gameArgs"
          render={({ field }) => (
            <NewGameSetting
              text={t("arguments")}
              description={t("the_arguments_to_pass_to_the_game")}
              field={field}
            />
          )}
        />

        <FormField
          control={form.control}
          name="gameCommand"
          render={({ field }) => (
            <NewGameSetting
              text={t("command")}
              description={t("the_command_to_run_the_game_e_g_wine")}
              field={field}
            />
          )}
        />
      </form>

      <DialogFooter className="pt-2">
        <DialogClose>
          <Button variant={"destructive"}>{t("cancel")}</Button>
        </DialogClose>
        <Button
          variant="secondary"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? `${t("adding")}...` : t("add_game")}
        </Button>
      </DialogFooter>
      {error && <p className="w-full text-right text-red-500">{error}</p>}
    </Form>
  );
};

export default NewGameForm;
