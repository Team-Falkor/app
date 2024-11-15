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

const NewGameSettingsForm = ({ form }: NewGameMetadataFormProps) => {
  const { t } = useLanguageContext();

  return (
    <div className="flex flex-col flex-1 gap-2.5">
      <FormField
        control={form.control}
        name="gameArgs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("arguments")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("the_arguments_to_pass_to_the_game")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gameCommand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("command")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("the_command_to_run_the_game_e_g_wine")}
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

export default NewGameSettingsForm;
