import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLanguageContext } from "@/contexts/I18N";
import { UseFormReturn } from "react-hook-form";
import { NewGameFormSchema } from "../schema";

interface NewGameMetadataFormProps {
  form: UseFormReturn<NewGameFormSchema>;
}

const NewGameMetadataForm = ({ form }: NewGameMetadataFormProps) => {
  const { t } = useLanguageContext();

  return (
    <div className="flex flex-col flex-1 gap-2.5">
      <FormField
        control={form.control}
        name="gameName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("name")}</FormLabel>
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
            <FormLabel>{t("path")}</FormLabel>
            <FormControl>
              <Input placeholder={t("the_path_to_the_game")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gameId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("id")}</FormLabel>
            <FormControl>
              <Input placeholder={t("game_id")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gameIcon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("icon")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("the_path_or_url_of_the_icon")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NewGameMetadataForm;
