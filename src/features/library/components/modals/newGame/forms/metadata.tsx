import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLanguageContext } from "@/contexts/I18N";
import { useFormActions } from "@/features/library/hooks/useFormActions";
import { FolderOpen, Shuffle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { NewGameFormSchema } from "../schema";

interface NewGameMetadataFormProps {
  form: UseFormReturn<NewGameFormSchema>;
}

const NewGameMetadataForm = ({ form }: NewGameMetadataFormProps) => {
  const { t } = useLanguageContext();
  const { handleIconButton, handlePathButton, handleShuffleButton } =
    useFormActions(form);

  return (
    <div className="flex flex-col flex-1 gap-2.5">
      <FormField
        control={form.control}
        name="gameName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("name")}*</FormLabel>
            <FormControl>
              <Input placeholder={t("the_name_of_the_game")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gamePath"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("path")}*</FormLabel>

            <div className="flex flex-row flex-1 gap-1">
              <FormControl>
                <Input placeholder={t("the_path_to_the_game")} {...field} />
              </FormControl>
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={(e) => {
                  e.preventDefault();
                  handlePathButton();
                }}
              >
                <FolderOpen />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gameId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("id")}*</FormLabel>
            <div className="flex flex-row flex-1 gap-1">
              <FormControl>
                <Input placeholder={t("game_id")} {...field} />
              </FormControl>
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={(e) => {
                  e.preventDefault();
                  handleShuffleButton();
                }}
              >
                <Shuffle />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gameIcon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("icon")}*</FormLabel>

            <div className="flex flex-row flex-1 gap-1">
              <FormControl>
                <Input
                  placeholder={t("the_path_or_url_of_the_icon")}
                  {...field}
                />
              </FormControl>
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={(e) => {
                  e.preventDefault();
                  handleIconButton();
                }}
              >
                <FolderOpen />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="igdbId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("igdb_id")}</FormLabel>
            <FormControl>
              <Input placeholder={t("igdb_id")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NewGameMetadataForm;
